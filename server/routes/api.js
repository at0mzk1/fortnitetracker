var express = require('express')
var router = express.Router()
var rp = require('request-promise');
const Models = require('../models');
var cleanResponse = require('../util/responseHandler.js');

let Players = [];
let users = ["Conciente", "jrxtepan", "rmena28", "hamlet_rannier", "erickcortorreal2", "micky0512", "wilo_net", "javierskeemrd", "luisfrankrd", "luisjoserd_", "LilRebelz", "littlerflow809", "LilJayO84"];

let response = function (data, status) {
    return {
        "data": data,
        "status": status
    }
};

var cron = setInterval(function () {
    syncPlayers();
}, 1000 * 60 * 60);

syncPlayers = () => {
    var index = 0;
    sync = setInterval(function () {
        getPlayerInfo(index)
        if (index >= users.length - 1) {
            index = 0;
            clearInterval(sync);
        }
        else {
            index++;
        }
    }, 3000);
}

router.get('/player/:player', function (req, res) {
    res.contentType('application/json');
    Models.player.findAll({
        where: {
            name: req.params.player
        },
        include: [{
            model: Models.stat
        }]
    }).then(player => {
        res.send(player);
    })
});

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

router.post('/user', function (req, res) {
    console.log(req.body);
    res.send("Response from API");
});

router.get('/user/:userId', function (req, res) {
    console.log(req.body);
    Models.user.findAndCountAll({
        where: {
            userid: req.params.userId
        }
    }).then(user => {
        if (user.count > 0)
            res.send(user);
        else
            res.send({ "response": "User not found" });
    })
});

getPlayerInfo = (i) => {
    var options = {
        uri: 'https://api.fortnitetracker.com/v1/profile/psn/' + users[i],
        qs: {
        },
        headers: {
            'TRN-Api-Key': '92966a1e-ff13-4493-92e6-e44679f2e550'
        },
        json: true
    }

    rp(options).then((response) => {
        response.json;
        Players = cleanResponse.cleanResponse(response);
        Players.map((player, i) => {
            Models.player.upsert({
                name: player.name,
                accountId: player.accountId
            }).then(() => {
                Models.player.findOne({ where: { name: player.name } }).then(record => {
                    Models.stat.upsert({
                        player_id: record.id,
                        season: player.season,
                        mode: player.mode,
                        rating: player.trn_rating,
                        wins: player.wins,
                        top10: player.top_10,
                        kd: player.kd,
                        matches: player.matches,
                        kills: player.kills,
                        avg_match_time: player.avg_match_time
                    });
                })
            })
        });
    })
    console.log("Player info updated: ", users[i]);
}

module.exports = router;