var express = require('express')
var router = express.Router()
const Models = require('../models');
const Fortnite = require("fortnite-api");
var rp = require('request-promise');
var cleanResponse = require('../util/responseHandler.js');

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
            model: Models.stat
        }]
    }).then(player => {
        res.send(player);
    })
});

router.get('/profile/:user', function (req, res) {
    Models.user
        .find({
            include: [{
                model: Models.player,
                as: 'players',
                required: false,
                attributes: ['id', 'name'],
                through: { attributes: [] },
                include: [{ model: Models.stat}]
            }],
            where: { userid: req.params.user },
            attributes: ['id', 'userid', 'email'],
        }).then(profile => {
            res.send(profile);
        })
});

router.get('/player/:player/:season', function (req, res) {

    fortniteAPI.login().then(() => {
                fortniteAPI
                    .getStatsBR(req.params.player, "ps4", req.params.season)
                    .then(stats => {
                        Player = cleanResponse.cleanApiResponse(stats, req.params.season === "weekly" ? "current" : "lifetime");
                        res.json({
                            success: true,
                            stats,
                            Player
                        });
                    })
                    .catch(err => {
                        res.json({
                    success: false,
                    err
                    });
                    })
            });


    //     fortniteAPI.login().then(
    //         () => {
    //             ["pc", "ps4", "xb1"].forEach((platform) => {
    //         fortniteAPI
    //             .checkPlayer(req.params.player, platform)
    //             .then(stats => {
    //                 console.log(stats);
    //                 plat[platform] = true;
    //                 console.log(plat);
    //                 // exists.push({ platform: platform, exists: true});
    //                 })
    //                 .catch(err => {
    //                     // exists.push({ platform: platform, exists: false });
    //                                 })
    //     });
    // }).then(() => {
    //     console.log(plat);
    //     // console.log("exists: " + exists);
    //     res.json({
    //         success: exists
    //     });
    // });
});

router.get('/player1/:player', function (req, res) {
        var options = {
            uri: 'https://api.fortnitetracker.com/v1/profile/psn/' + req.params.player,
            headers: {
                'TRN-Api-Key': '92966a1e-ff13-4493-92e6-e44679f2e550'
            },
            json: true
        }

        rp(options).then((response) => {
            response.json;
            Player = cleanResponse.cleanResponse(response);
            res.json({
                success: true,
                Player
            })
        });

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

module.exports = router;