const Fortnite = require("fortnite-api");
var rp = require('request-promise');

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

module.exports.checkPlayer = function (player, found) {
    let notFound = 0;
    return fortniteAPI.login().then(() => {
                platforms.forEach((platform) => {
            fortniteAPI
                .checkPlayer(player, platform)
                .then(stats => {
                    Object.defineProperty(stats, "name", Object.getOwnPropertyDescriptor(stats, "displayName"));
                    delete stats["displayName"];
                    Object.defineProperty(stats, "accountId", Object.getOwnPropertyDescriptor(stats, "id"));
                    delete stats["id"];
                    stats["platform"] = platform;
                    return found(stats, notFound, null);
                })
                .catch(err => {
                    return found(null, notFound++, err);
                })
        });
    });
}