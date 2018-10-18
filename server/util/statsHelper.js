var rp = require('request-promise');
const Models = require('../models');
var cleanResponse = require('./responseHandler.js');
const Fortnite = require("fortnite-api");
const Timer = require("./timerUtil");

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
let playerList = [];

var cron = setInterval(function () {
            playerList = [];
            Models.player.findAll().then(players => {
                updatePlayerList(players);
            })
            syncPlayers();
        }, process.env.intervalTimer);

updatePlayerList = (players) => {
    players.forEach(player => {
        playerList.push({name: player.name, id: player.accountId, platform: player.platform, season: "alltime", lastUpdated: player.updatedAt});
        playerList.push({name: player.name, id: player.accountId, platform: player.platform, season: "weekly", lastUpdated: player.updatedAt});
    })
}

syncPlayers = () => {
    var index = 0;
    sync = setInterval(function () {
            var d = new Date();
        var timeDiff = d - playerList[index].lastUpdated;
            if (timeDiff > 3600000) {
                console.log(playerList[index].name + " needs to be updated..")
                getPlayerInfo1(playerList[index].id, playerList[index].platform, playerList[index].season);
            }
            else {
                console.log("No updated needed for " + playerList[index].name);
            }
        if (index >= playerList.length - 1) {
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
                    Models.stats.upsert({
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

getPlayerInfo1 = (accountId, platform, season) => {
    console.log("User to be updated: " + accountId);
    
    fortniteAPI.login().then(() => {
        fortniteAPI
            .getStatsBRFromID(accountId, platform, season)
            .then(stats => {
                console.log("Response received, updating DB...");
                PlayerStats = cleanResponse.cleanApiResponse(stats, season);
                Models.player.upsert({
                    name: stats.info.username,
                    accountId: stats.info.accountId,
                    platform: stats.info.platform
                }).then(() => {
                    console.log("Player table updated.");
                })

                PlayerStats.map((player, i) => {
                        Models.player.findOne({ where: { name: player.name } }).then(record => {
                            Models.stats.upsert({
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
    })
    console.log("Player info updated: ", accountId);
}

updatePlayers = () => {
    playerList = [];
    Models.player.findAll().then(players => {
        updatePlayerList(players);
    })
    syncPlayers();
}

updatePlayers();