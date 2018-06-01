'use strict';

let labels = ["kd", "matches", "trnRating", "avgTimePlayed", "top1", "top10", "kills"];
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
                season_label = season.match(/curr_/) ? "current" : "lifetime";
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

let calcTop10 = (amount) => {
    top10 += parseInt(amount);
}