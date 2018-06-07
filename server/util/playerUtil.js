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
let exists = [];
function checkPlayer(player) {

    return fortniteAPI.login().then(() => {
                platforms.forEach((platform) => {
            fortniteAPI
                .checkPlayer(player, platform)
                .then(stats => {
                    console.log(stats);
                    // exists.push({platform: platform, success: true});
                }
                )
                .catch(err => {
                    console.log(err);
                    // exists.push({ platform: platform, success: false });
                })
        });
    });
}