var rp = require('request-promise');
const Models = require('../models');
var cleanResponse = require('./responseHandler.js');
const Fortnite = require("fortnite-api");

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

let Players = [];
let users = ["Conciente", "jrxtepan", "rmena28", "hamlet_rannier", "SalamiRD", "micky0512", "wilo_net", "javierskeemrd", "luisfrankrd", "Piimposh", "luisjoserd_", "LilRebelz", "littlerflow809", "LilJayO84"];

var cron = setInterval(function () {
    syncPlayers();
}, 1000 * 60 * 100);

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
            console.log(player);
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

//================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================

// var cron = setInterval(function () {
//     syncPlayers1();
// }, 1000 * 60 * 2);

syncPlayers1 = () => {
    var index = 0;
    sync = setInterval(function () {
        Models.player.findAll().then(players => {
            ["weekly","lifetime"].forEach((season) => {
                for(player in players) {
                    var d = new Date();
                    var timeDiff = d - players[player].updatedAt;

                    if (timeDiff > 3600000) {
                        console.log(players[player].name + " needs to be updated..")
                        getPlayerInfo1(players[player].accountId, players[player].platform, season);
                    }
                    else {
                        console.log("No updated needed for " + players[player].name);
                    }
                }
            })
        })
    }, 5000);
}

getPlayerInfo1 = (accountId, platform, season) => {
    console.log("User to be updated: " + accountId);
    
    fortniteAPI.login().then(() => {
        fortniteAPI
            .getStatsBRFromID(accountId, platform, season)
            .then(stats => {
                console.log(stats);
                PlayerStats = cleanResponse.cleanApiResponse(stats);
                Models.player.upsert({
                    name: stats.info.username,
                    accountId: stats.info.accountId,
                    platform: stats.info.platform
                }).then(() => {
                    console.log("Player table updated.");
                })

                PlayerStats.map((player, i) => {
                        Models.player.findOne({ where: { name: player.name } }).then(record => {
                            Models.stat.upsert({
                                player_id: record.id,
                                season: player.season,
                                mode: player.mode,
                                score: player.score,
                                wins: player.wins,
                                top10: player.top_10,
                                kd: player.kd,
                                matches: player.matches,
                                kills: player.kills,
                                win_percentage: player.win_percentage
                            });
                        })
                    })
            })
            .catch(err => {
                console.log(err);
            });
    });

    console.log("Player info updated: ", accountId);
}

// syncPlayers1();
getPlayerInfo1("fb5660aa044a4b399680b657f2443301", "ps4", "weekly");