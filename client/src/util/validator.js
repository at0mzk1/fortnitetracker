let validationState = null;

export default function validate(field, value, secondValue) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (field === "userId" && (value.length < 6 || value.length > 10))
        return "error";
    else if (field === "userId" && (value.length > 6 || value.length < 10)) {
        return validateUserId(value);
    }
    if (field === "emailAddress" && !re.test(value))
        return "error";
    if (field === "confirmPassword" && !(value === secondValue))
        return "error";

    return null;
}

async function validateUserId(value) {

   let response = await fetch('http://localhost:5000/user/' + value, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });

    let json = await response.json();
    setValidationState(json.response === "User not found" ? "success" : "error");

    console.log(validationState);
    return validationState;
}

function setValidationState(state) {
    validationState = state;
}