function getInput() {
  console.log("Requesting input sample");
  const request = new XMLHttpRequest();
  request.responseType = "json";
  request.open("GET", "http://localhost:8888");
  request.onload = function () {
    console.log("Input sample received");
    document.getElementById('input_sample').textContent = JSON.stringify(request.response, undefined, 2);
  };
  request.send();
};

function stripEmpty(obj) {
  return Object.keys(obj).filter(function (k) {
    return obj[k] !== null && obj[k] !== ""
  }).reduce(function (acc, k) {
    var v = obj[k];
    if (typeof v === "object") {
      v = stripEmpty(v);
      if (Object.keys(v).length !== 0) {
        acc[k] = v;
      };
    } else {
      acc[k] = v;
    };
    return acc;
  }, {});
};

function handleSubmit(event) {
  event.preventDefault();

  console.log("Processing form")
  const data = new FormData(event.target);
  const formValue = Object.fromEntries(data.entries());
  var numChildren = parseInt(formValue.dependents__number_of_children);
  if (isNaN(numChildren)) {
    numChildren = null;
  };
  const application = {
    account: {
      email: formValue.email,
    },
    applicant: {
      first_name: formValue.first_name,
      middle_name: formValue.middle_name,
      last_name: formValue.last_name,
      date_of_birth: formValue.date_of_birth,
      spouse: {
        first_name: formValue.spouse__first_name,
        middle_name: formValue.spouse__middle_name,
        last_name: formValue.spouse__last_name,
        date_of_birth: formValue.spouse__date_of_birth,
      },
      dependents: {
        number_of_children: numChildren,
      },
    },
    mailing_address: {
      address1: formValue.address1,
      address2: formValue.address2,
      address3: formValue.address3,
      city: formValue.city,
      state: formValue.state,
      zip: formValue.zip,
    },
  };
  const payload = JSON.stringify(stripEmpty(application));

  console.log("Sending payload")
  console.log(payload);
  const request = new XMLHttpRequest();
  request.responseType = "json";
  request.open("POST", "http://localhost:8888");
  request.setRequestHeader("Content-type", "application/json")
  request.onload = function () {
    console.log("Response received");
    document.getElementById("response").textContent = JSON.stringify(request.response, undefined, 2);
  };
  request.send(payload);
};
document.getElementById("application_form").addEventListener("submit", handleSubmit);
