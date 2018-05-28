const express = require('express');
const passport = require('passport');
const router = express.Router();
const Models = require('../models');

router.post('/signup', (req, res, next) => {
    return passport.authenticate('signup', (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err
            });
        }

        return res.status(200).json({
            success: true,
            message: 'You have successfully signed up! Now you should be able to log in.'
        });
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    return passport.authenticate('login', (err, token, userData) => {
        if (err) {
            if (err.name === 'IncorrectCredentialsError') {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(400).json({
                success: false,
                message: err
            });
        }

        return res.json({
            success: true,
            message: 'You have successfully logged in!',
            token,
            user: userData
        });
    })(req, res, next);
});

router.get('/user/:userId', function (req, res) {
    Models.user.count({
        where: {
            userid: req.params.userId
        }
    }).then(count => {
        if (count > 0)
            res.status(400).json({
                success: false,
                message: "User ID already exists."
            });
        else
            res.status(200).json({
                success: true,
                message: 'User ID is valid.'
            });
    })
});

module.exports = router;