'use strict';

let labels = ["kd", "matches", "score", "win%", "wins", "top10", "kills", "win"];
let top10 = 0;

module.exports.cleanResponse = function(data) {
    let FortnitePlayerStats = [];

    let season_label = '';
    let mode_label = '';

    for (var season in data.stats) {
        let FortnitePlayer = {};
        FortnitePlayer.name = data.epicUserHandle;
        FortnitePlayer.accountId = data.accountId;
        for (var key in data.stats[season]) {
            key.match(/top3|top5|top6|top10/) ? calcTop10(data.stats[season][key].value) : null;
            if (labels.indexOf(key) > -1) {
                season_label = season.match(/curr_/) ? "current" : season_label = season.match(/prior_/) ? "prior" : "lifetime";
                mode_label = season.match(/p2/) ? "solo" : season.match(/p10/) ? "duo" : "squad";
                FortnitePlayer["season"] = season_label;
                FortnitePlayer["mode"] = mode_label;
                FortnitePlayer[data.stats[season][key].label.replace(/ /gi, "_").toLowerCase().replace(/\//gi, "")] = data.stats[season][key].value;
            }
        }
        FortnitePlayer.top_10 = top10;
        FortnitePlayerStats.push(FortnitePlayer);
        top10 = 0;
    }
    return FortnitePlayerStats;
}

module.exports.cleanApiResponse = function (data, season) {
    let FortnitePlayerStats = [];
    for (var mode in data.group) {
        let FortnitePlayer = {};
        FortnitePlayer.name = data.info.username;
        FortnitePlayer.accountId = data.info.accountId;
        FortnitePlayer.platform = data.info.platform;
        for (var key in data.group[mode]) {
            key.match(/top3|top5|top6|top10/) ? calcTop10(data.group[mode][key]) : null;
            if (labels.indexOf(key.replace(/[^a-zA-Z ]/g, "")) > -1) {
                FortnitePlayer["season"] = season.match(/weekly/) ? "current" : season.match(/alltime/) ? "lifetime" : "invalid";
                FortnitePlayer["mode"] = mode;
                if(key.replace(/[^a-zA-Z ]/g, "") === "win") {
                    FortnitePlayer["win_percentage"] = data.group[mode][key];
                }
                FortnitePlayer[key.replace(/[^a-zA-Z ]/g, "")] = data.group[mode][key];
            }
        }
        FortnitePlayer.top_10 = top10;
        FortnitePlayerStats.push(FortnitePlayer);
        top10 = 0;
    }
    return FortnitePlayerStats;
}

let calcTop10 = (amount) => {
    top10 += parseInt(amount);
}