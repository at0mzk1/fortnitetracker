const express = require('express');
const passport = require('passport');
const router = express.Router();
const Models = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

router.post('/forgot', function (req, res, next) {
    return passport.authenticate('forgotpassword', (err, token) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'martinez.amir@gmail.com',
                    pass: 'elgchzhoucacoylm'
                }
            });
            var mailOptions = {
                to: req.body.email.trim(),
                from: 'passwordreset@at0mzgaming.surge.sh',
                subject: 'at0mzGaming Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    req.headers.origin + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }

                return res.json({
                    success: true,
                    message: 'An e-mail has been sent to ' + req.body.email.trim() + ' with further instructions.'
                });
            });

        
    })(req, res, next);
});

router.get('/reset/:token', function (req, res) {
    Models.user.findOne({
        where: { resetPasswordToken: req.params.token, 
                 resetPasswordExpires: { [Op.gt]: Date.now() } }}).then(user => {
                    
            if(user) {
                return res.json({
                    success: true,
                    message: 'Token valid'
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Password reset token is invalid or has expired."
                });
            }
        }).catch(function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Password reset token is invalid or has expired."
                });
            }
        });
});

router.post('/reset/:token', function (req, res) {
    Models.user.findOne({
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { [Op.gt]: Date.now() }
        }
    }).then(user => {
        if (user) {
            user.password = req.body.password;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            user.save().then(user => {
                return res.json({
                    success: true,
                    message: 'Your password has been changed successfully. Please log in with your new credentials.'
                });
            }).catch(function (err) {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Password reset token is invalid or has expired."
            });
        }
    }).catch(function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    });
    // async.waterfall([
    //     function (done) {
    //         User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    //             if (!user) {
    //                 req.flash('error', 'Password reset token is invalid or has expired.');
    //                 return res.redirect('back');
    //             }

    //             user.password = req.body.password;
    //             user.resetPasswordToken = undefined;
    //             user.resetPasswordExpires = undefined;

    //             user.save(function (err) {
    //                 req.logIn(user, function (err) {
    //                     done(err, user);
    //                 });
    //             });
    //         });
    //     },
    //     function (user, done) {
    //         var smtpTransport = nodemailer.createTransport('SMTP', {
    //             service: 'SendGrid',
    //             auth: {
    //                 user: '!!! YOUR SENDGRID USERNAME !!!',
    //                 pass: '!!! YOUR SENDGRID PASSWORD !!!'
    //             }
    //         });
    //         var mailOptions = {
    //             to: user.email,
    //             from: 'passwordreset@demo.com',
    //             subject: 'Your password has been changed',
    //             text: 'Hello,\n\n' +
    //                 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
    //         };
    //         smtpTransport.sendMail(mailOptions, function (err) {
    //             req.flash('success', 'Success! Your password has been changed.');
    //             done(err);
    //         });
    //     }
    // ], function (err) {
    //     res.redirect('/');
    // });
});

module.exports = router;