var rp = require('request-promise');
const Models = require('../models');
var cleanResponse = require('./responseHandler.js');

let Players = [];
let users = ["Conciente", "jrxtepan", "rmena28", "hamlet_rannier", "SalamiRD", "micky0512", "wilo_net", "javierskeemrd", "luisfrankrd", "Piimposh", "luisjoserd_", "LilRebelz", "littlerflow809", "LilJayO84"];

var cron = setInterval(function () {
    syncPlayers();
}, 1000 * 60 * 10);

syncPlayers = () => {
    var index = 0;
    sync = setInterval(function () {
        Models.player.findOne({
            where: {
                name: users[index]
            },
            include: [{
                model: Models.stat
            }]
        }).then(player => {
            var d = new Date();
            var timeDiff = d - player.updatedAt;
            console.log("Current Date: " + d);
            console.log("Last updated: " + player.updatedAt);
            if (timeDiff > 3600000) {
                console.log(player.name + " needs to be updated..")
                getPlayerInfo(player.name);
            }
            else {
                console.log("No updated needed for " + player.name);
            }
        })
        if (index >= users.length - 1) {
            index = 0;
            clearInterval(sync);
        }
        else {
            index++;
        }
    }, 5000);
}

getPlayerInfo = (user) => {
    console.log("User to be updated: " + user);
    var options = {
        uri: 'https://api.fortnitetracker.com/v1/profile/psn/' + user,
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
    console.log("Player info updated: ", user);
}