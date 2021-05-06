# Application Form

This is an exercise designed to evaluate your frontend development skills. You are being evaluated on your technical implementation and design.

We expect your submission to be functional and to show us some of what you can do. Given the time constraints, we do not expect a fully finished product but we expect that you can speak to the concessions that you make.

Expect to spend 3-6 hours on this problem and try not to spend more than 6 hours on it. What you choose not to implement due to time constraints and why is just as important to us as what you do implement.

## Confidentiality

We ask that you keep this prompt, the context of the problem, and the fact that this is a LifeRaft interview question confidential. We understand that the work you produce in response to this prompt is yours to do with as you please.

## Context

In the course of our business as an insurance company, we need to gather information about new and existing customers as well as any people or assets that they may want to ensure. A key tool in our information gathering toolbox is form processing.

We would like to build a frontend tool for processing dynamic forms. We might want this for collecting initial information for a person requesting a policy or we might want to launch a form to collect information about a spouse when an existing customer looks to add a spouse to a policy. The characteristics of the information to be collected depends on data in our backend systems.

## Problem Statement

Included in this folder is a very basic backend service and frontend client to collect user information. We would like you to reimplement the sample frontend client to generate the form dynamically and provide a guided flow for our users.

### Sample server/client

The sample backend runs in Python and uses only the standard library so no setup is required. It has been tested on Python 2.7, 3.6, 3.7, 3.8, and 3.9. You can run the sample backend by executing (exit with Ctrl+C):

```sh
python server.py
```

The sample frontend can be run by opening `client.html` in a web browser. It has been tested in Chrome.

The server responds to OPTIONS, GET, and POST requests. A GET request to `http://localhost:8888` will respond with the information desired from the form. A POST request to `http://localhost:8888` can be used to send a json response.

Successful form submissions will be recorded as entries in `applications.jsonlines`.

### Deliverables

Access to a git repository containing the provided backend and a frontend that can be opened in a browser or a zipfile containing the same.

GitHub repos should be public or shared with:

-   gwax (https://github.com/gwax)
-   noahvanhoucke (https://github.com/noahvanhoucke)
-   ianblu1 (https://github.com/ianblu1)
-

If you use any packaging system to transcode/bundle/compress your code (e.g. babel or webpack), please make sure that your submission includes both the original source and a ready-to-test build.

### Requirements

A single-page-application to walk the user through filling in the form data.

We want to have a series of questions asking related blocks of information conditional on each other:

1. Ask for name and date of birth
2. Ask for email address
3. Ask if they want to enroll a spouse
    1. If yes, ask for spouse name and date of birth
4. Ask if they have any dependent children
    1. If yes, ask how many
5. Ask for a mailing address

We should be able to navigate back via the browser's back button as well as forward and back through controls in the application itself.

State should be stored in the browser in case the user leaves and comes back later.

The form should ask for fields based on the results of the GET call to the backend. You may optimize for the specific case included as long as your solution can handle additional fields or the removal of fields.

Finally, we should be able to submit via POST to the backend.

### Constraints

You are not expected to change the backend but you may as long as it does not fundamentally alter the nature of the problem (e.g. if you want to reformat/restructure `application_config_v1.json`, feel free as long as it remains human-readable and the contents don't change).

You can assume the following about our execution environment:

-   We are running on OSX
-   We will open your submission with Chrome or Safari
-   We have nvm installed
-   We have python3.8+ installed
-   We have Docker Desktop installed
-   We have Xcode cli tools installed

Don't assume anything else about the execution environment we will use to evaluate your submission. If there is any additional setup necessary, please include clear documentation, a Makefile, or similar.

### Questions

If you have any questions, please reach out right away so that we can get you an answer while still allowing you the most time possible.
