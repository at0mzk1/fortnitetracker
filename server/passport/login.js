const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config/db');
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
        password: password.trim()
    };

    // find a user by User ID
    return Models.user.findOne({
        where: { userid: userData.userid }
    }).then(user => {
        if (user == null) {
            const error = new Error('Incorrect User ID');
            error.name = 'IncorrectCredentialsError';

            return done(error);
        }

        // check if a hashed user's password is equal to a value saved in the database
        return user.validPassword(userData.password, (passwordErr, isMatch) => {
            
            if (!isMatch) {
                const error = new Error('Incorrect password');
                error.name = 'IncorrectCredentialsError';

                return done(error);
            }

            const payload = {
                sub: user.id
            };

            // create a token string
            const token = jwt.sign(payload, config.jwtSecret);
            const data = {
                name: user.userid
            };

            return done(null, token, data);
        });
    }).catch(function (err) {
            if (err) {return done(err);}
        });;
});