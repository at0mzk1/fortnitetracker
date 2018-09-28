import Auth from './auth';

export default {
    
    get(endpoint, parameter, done) {
        fetch(process.env.REACT_APP_API_HOSTNAME + endpoint + parameter, {
            headers: {
                'Authorization': getAuth()
            }
        }).then((results) => results.json())
            .then(results => {
            done(results);
            });
        },
    post(endpoint, parameter, body, done) {
        fetch([process.env.REACT_APP_API_HOSTNAME, endpoint, parameter].join(''), {
            headers: {
                Authorization: getAuth(),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        }).then((results) => results.json())
            .then(results => {
                done(results);
            });
    }
}

const getAuth = () => {
    return Auth.getToken() === null ? null : "bearer " + Auth.getToken();
}