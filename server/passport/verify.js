const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
    session: false,
    passReqToCallback: true
}, (req, done) => {
    // find a user by User ID
     jwt.verify(token, config.jwtSecret, function(err, results) {
        if (err) { return done(err); }
        return done(results);
    });
});