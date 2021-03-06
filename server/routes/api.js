var express = require('express')
var router = express.Router()
const Models = require('../models');
const Fortnite = require("fortnite-api");
var responseHandler = require('../util/responseHandler.js');
var playerUtil = require('../util/playerUtil.js')
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const timer = require('../util/timerUtil')

let fortniteAPI = new Fortnite(
    [
        process.env.apiUser,
        process.env.apiPassword,
        process.env.apiLauncherToken,
        process.env.apiClientToken
    ],
    {
        debug: true
    }
);

let platforms = ["pc", "ps4", "xb1"];

let response = function (data, status) {
    return {
        "data": data,
        "status": status
    }
};

router.get('/players', function (req, res) {
    res.contentType('application/json');
    Models.player.findAll({
        include: [{
            model: Models.stats
        }]
    }).then(player => {
        res.send(player);
    })
});

router.get('/timer', function (req, res) {
    let timeLeft = timer.getTimer();
    res.status(200).json({
        success: true,
        timeLeft
    });
});

router.get('/profile/:user', function (req, res) {
    
    Models.user
        .find({
            include: [{
                model: Models.player,
                as: 'players',
                required: false,
                attributes: ['id', 'name', 'platform'],
                through: {where: {primaryid: true}, attributes: []},
                include: [{ model: Models.stats}]
            }],
            where: { userid: req.params.user },
            attributes: ['id', 'userid', 'email']
        }).then(primary => {
            Models.user.scope('noAttributes')
                .find({
                    include: [{
                        model: Models.player,
                        as: 'players',
                        required: false,
                        attributes: ['id', 'name', 'platform'],
                        through: { where: { primaryid: false }, attributes: [] },
                        include: [{ model: Models.stats }]
                    }],
                    where: { userid: req.params.user }
                }).then(friends => {
                    res.status(200).json({
                        success: true,
                        id: primary.id,
                        userid: primary.userid,
                        email: primary.email,
                        primary: responseHandler.formatPlayerResponse(primary.players, "primary"),
                        friends: responseHandler.formatPlayerResponse(friends.players, "friends")
                    });
                })
        })
});

router.get('/checkPlayer/:player', function (req, res) {
    Models.player
        .findOne({
            where: { name: req.params.player },
            attributes: ['id', 'name', 'accountId', 'platform'],
        }).then(player => {
            if(player == null) {
               playerUtil.checkPlayer(req.params.player, function (stats, notFound, err) {
                   if (stats != null && platforms.includes(stats.platform) && !res.headersSent)
                       addRelationship(req.headers.authorization.substr(7), stats, res);
                   if (notFound == 2 && !res.headersSent)
                       res.status(400).json({
                           success: false,
                           err
                       });
                });
            }
            else {
                addRelationship(req.headers.authorization.substr(7), player, res);
            }
        }).catch(err => {
            res.send(err);
        })
});

router.get('/removePlayer/:player', function (req, res) {
    Models.player
        .findOne({
            where: { name: req.params.player },
            attributes: ['id', 'name', 'accountId', 'platform'],
        }).then(player => {
            if (player == null) {
                playerUtil.checkPlayer(req.params.player, function (stats, notFound, err) {
                    if (stats != null && platforms.includes(stats.platform) && !res.headersSent)
                        removeRelationship(req.headers.authorization.substr(7), stats, res);
                    if (notFound == 2 && !res.headersSent)
                        res.status(400).json({
                            success: false,
                            err
                        });
                });
            }
            else {
                removeRelationship(req.headers.authorization.substr(7), player, res);
            }
        }).catch(err => {
            res.send(err);
        })
});

router.get('/news', function(req, res) {
    fortniteAPI.login().then(() => {
        fortniteAPI
            .getFortniteNews("en")
            .then(news => {
                res.json({
                    success: true,
                    news
                });
            })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    message: err
                });
            });
    });
})

addRelationship = (token, player, res) => {
    return jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err
            });
        }
        let currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 2);

        Models.player.findOrCreate({ where: {
            name: player.name,
            accountId: player.accountId,
            platform: player.platform
        }, defaults: { updatedAt: currentDate }
        }).spread((player, created) => {
                Models.user
                    .findOne({
                        where: { userid: decoded.sub }
                    }).then(user => {
                        user.addPlayer(player, { through: { attributes: [] } })

                    });
            })
        return res.status(200).json({
        success: true,
        player
        });
    });
}

removeRelationship = (token, player, res) => {
    return jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err
            });
        }
        let currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 2);

        if(player != null) {
            Models.user
                .findOne({
                    where: { userid: decoded.sub }
                }).then(user => {
                    user.removePlayer(player, { through: { attributes: [] } })
                });
            return res.status(200).json({
                success: true,
                player
            });
        }
        else
            return res.status(400).json({
                success: false,
                message: "Player does not exist in the system."
            });        
    });
}

module.exports = router;