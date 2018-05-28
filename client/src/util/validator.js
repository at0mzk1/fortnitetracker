let status = {};

export default function validate(e) {
    const formData = Array.from(e.target.elements)
        .filter(el => el.id)
        .reduce((a, b) => ({ ...a, [b.id]: b.value }), {});
    
    
    validateUserId(formData.userid).then(userStatus => {
        return setValidationState(userStatus);
    })

    setValidationState(validatePassword(formData.password, formData.confirmPassword));
    setValidationState(validateEmail(formData.email));
    return status;
}

function setValidationState(element) {
    status[element.field] = element.state;
}

async function validateUserId(value) {

   let response = await fetch('http://localhost:5000/auth/user/' + value, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });

    let json = await response.json();

    return {field: "userId", state: json.success === true ? "valid" : json.message };
}

function validatePassword(password, confirmPassword) {
    return { field: "password", state: password === confirmPassword ? "valid" : "Passwords must match" };
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return { field: "email", state: re.test(email) ? "valid" : "Email is not valid." };
}
