let validationState = null;


export default function validate(e) {
    const formData = Array.from(e.target.elements)
        .filter(el => el.id)
        .reduce((a, b) => ({ ...a, [b.id]: b.value }), {});
        

}


// export default function validate(field, value, secondValue) {
//     var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     if (field === "userId" && (value.length < 6 || value.length > 10))
//         return "error";
//     if (field === "emailAddress" && !re.test(value))
//         return "error";
//     if (field === "confirmPassword" && !(value === secondValue))
//         return "error";

//     return null;
// }

async function validateUserId(value) {
    console.log("userID: " + value);

    fetch('http://localhost:5000/auth/user/' + value)
        .then(response => {
            console.log("response: " + response);
        });

   let response = await fetch('http://localhost:5000/auth/user/' + value, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });

    let json = await response.json();
    console.log("response: " + json);
    setValidationState(json.response === "User not found" ? "success" : "error");

    console.log("state: " + validationState);
    return validationState;
}

function setValidationState(state) {
    validationState = state;
}