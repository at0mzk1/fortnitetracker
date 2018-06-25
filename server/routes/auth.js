const express = require('express');
const passport = require('passport');
const router = express.Router();
const Models = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

router.post('/signup', (req, res, next) => {
    return passport.authenticate('signup', (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
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
                message: err.message
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

router.post('/verify', (req, res, next) => {
    
    jwt.verify(req.body.token, config.jwtSecret, function (err, results) {
        if (err || results.uid !== req.headers["user-agent"].replace(/\D/g, "")) {
            return res.status(400).json({
                success: false,
                message: err
            });
        }

        return res.json({
            success: true,
            message: 'Token valid'
        });
    });
});

module.exports = router;