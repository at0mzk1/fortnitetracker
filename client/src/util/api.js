import Auth from './auth';

export default function callApi(endpoint, parameter, done) {

    fetch(process.env.REACT_APP_API_HOSTNAME + endpoint + parameter, {
        headers: {
            'Authorization': "bearer " + Auth.getToken()
        }
    }).then((results) => results.json())
        .then(results => {
           done(results);
        });

}