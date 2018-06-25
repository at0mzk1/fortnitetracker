const express = require('express');
const passport = require('passport');
var rp = require('request-promise');
require('./util/statsHelper');

const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

var cron = setInterval(function () {
    keepAlive();
}, 1000 * 60 * 2);

keepAlive = () => {
    var options = {
        uri: 'https://long-drink.glitch.me/alive',
        json: true
    }

    rp(options).then((response) => {
        response.json;
        console.log(response);
    });
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Max-Age", 3600);

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.status(200).end();
    }
    else {
        //move on
        next();
    }
});

app.get('/alive', function (req, res) {
    res.contentType('application/json');
        res.send("Keep Alive");
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/signup');
const localLoginStrategy = require('./passport/login');
const localVerifyStrategy = require('./passport/verify')
passport.use('signup', localSignupStrategy);
passport.use('login', localLoginStrategy);
passport.use('verify', localVerifyStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`));