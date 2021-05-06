#!/usr/bin/env python3
"""Run an http server that serves forms and accepts completed applications.

Note:
    This application is not representative of the code that you will find in
    our production environment. A number of choices have been made to ensure
    that this code can run without external libraries in a very broad set of
    Python environments.
"""

import os
import datetime as dt
from threading import Lock
import cgi
import json

try:
    from http import HTTPStatus
    from http.server import BaseHTTPRequestHandler, HTTPServer
except ImportError:
    # Python 2 :(
    import httplib as HTTPStatus
    from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler


HOST = "localhost"
PORT = 8888

LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))

CONFIG_PATH = os.path.join(LOCAL_DIR, "application_config_v1.json")
with open(CONFIG_PATH, "rt") as config_file:
    JSON_CONFIG = json.load(config_file)

RESPONSES_PATH = os.path.join(LOCAL_DIR, "applications.jsonlines")
RESPONSES_LOCK = Lock()


def validate_payload(payload):
    account = payload.get("account", {})
    assert account.get("email"), "No email"

    applicant = payload.get("applicant", {})
    assert applicant.get("first_name", ""), "No first name"
    assert applicant.get("last_name", ""), "No last name"
    try:
        dt.datetime.strptime(applicant.get("date_of_birth", ""), "%Y-%m-%d").date()
    except Exception:
        raise AssertionError("Bad date of birth")

    if "spouse" in applicant:
        spouse = applicant["spouse"]
        assert spouse.get("first_name", ""), "No spouse first name"
        assert spouse.get("last_name", ""), "No spouse last name"
        try:
            dt.datetime.strptime(spouse.get("date_of_birth", ""), "%Y-%m-%d").date()
        except Exception:
            raise AssertionError("Bad spouse date of birth")

    if "depdendents" in applicant:
        depdendents = applicant["dependents"]
        assert isinstance(
            depdendents["number_of_children"], int
        ), "Bad number of children"

    mailing_address = payload.get("mailing_address", {})
    assert mailing_address.get("address1", ""), "No address1"
    assert mailing_address.get("city", ""), "No city"
    assert mailing_address.get("state", ""), "No state"
    assert mailing_address.get("zip", ""), "No zip"


class ApplicationRequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(HTTPStatus.OK, "ok")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        """Retrieve configuration payload."""
        self.send_response(HTTPStatus.OK)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-type", "application/json")
        self.end_headers()

        payload = json.dumps(JSON_CONFIG)
        self.wfile.write(payload.encode("utf-8"))

    def do_POST(self):
        """Record application responses."""
        ctype, _ = cgi.parse_header(self.headers.get("content-type"))
        if ctype != "application/json":
            self.send_response(HTTPStatus.BAD_REQUEST)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"error":"json required"}')
            return

        length = int(self.headers.get("content-length"))
        body = self.rfile.read(length)
        payload = json.loads(body.decode("utf-8"))

        print(payload)
        try:
            validate_payload(payload)
        except Exception as err:
            print(err)
            self.send_response(HTTPStatus.BAD_REQUEST)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(err)}).encode("utf-8"))
            return
        print("valid")

        with RESPONSES_LOCK:
            with open(RESPONSES_PATH, "at") as response_file:
                json.dump(payload, response_file)
                response_file.write("\n")

        self.send_response(HTTPStatus.OK)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"received":"ok"}')


def main():
    print("Starting server at http://{HOST}:{PORT}".format(HOST=HOST, PORT=PORT))
    server = HTTPServer((HOST, PORT), ApplicationRequestHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
