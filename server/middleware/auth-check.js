const jwt = require('jsonwebtoken');
const Models = require('../models');
const config = require('../config/db');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }

    // get the last part from a authorization header string like "bearer token-value"
    const token = req.headers.authorization.split(' ')[1];

    // decode the token using a secret key-phrase
    return jwt.verify(token, config.jwtSecret, (err, decoded) => {
        // the 401 code is for unauthorized status
        if (err) { 
            res.status(401).end(err.message);
            return { success: false, error: err } 
        }

        const userId = decoded.sub;

        // check if a user exists
        return Models.user.findOne({where: {userid: userId}}).then(user => {
            if (!user) {
                return {success: false, error: err}
            }
            return { success: true, error: err };
        })
    }).then(authValid => {
        if(authValid.success) {
            next();
        } else {
            res.status(401).end(authValid.error);
        }
    });
};