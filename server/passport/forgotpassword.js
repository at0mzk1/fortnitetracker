const PassportLocalStrategy = require('passport-local').Strategy;
const Models = require('../models');
const crypto = require('crypto');

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
    usernameField: 'userid',
    passwordField: 'email',
    session: false,
    passReqToCallback: true
}, (req, userid, email, done) => {
    
    const userData = {
        userid: userid,
        email: email
    };

    // find a user by Email
    return Models.user.findOne({
        where: { email: userData.email }
    }).then(user => {
        if (user == null) {
            const error = new Error('No account with that email address exists.');
            error.name = 'IncorrectEmailError';

            return done(error);
        }
        var token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save().then(user => {
            done(null, token);
        }).catch(function (err) {
            if (err) { return done(err); }
        });
    }).catch(function (err) {
            if (err) {return done(err);}
        });
});