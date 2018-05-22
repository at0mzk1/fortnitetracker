const PassportLocalStrategy = require('passport-local').Strategy;
const Models = require('../models');

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
    usernameField: 'userid',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, userid, password, done) => {
    const userData = {
        userid: userid,
        password: password.trim(),
        email: req.body.email.trim()
    };
    
    Models.user.findOrCreate({ where: { 
        userid: userData.userid,
        email: userData.email
    },
        defaults: { // set the default properties if it doesn't exist
            password: userData.password
        }
    }).spread((user, created) => {
        if (!created) {
            const error = new Error('User ID already exists!');
            error.name = 'ExistingUserError';
            return done(error);
        }

        return done(null);
        })
});