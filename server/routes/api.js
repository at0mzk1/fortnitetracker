var express = require('express')
var router = express.Router()
const Models = require('../models');

let response = function (data, status) {
    return {
        "data": data,
        "status": status
    }
};

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

router.get('/user/:userId', function (req, res) {
    Models.user.count({
        where: {
            userid: req.params.userId
        }
    }).then(count => {
        if (count > 0)
            res.status(400).json({
                success: false,
                message: "User ID already exists."
            });
        else
            res.status(200).json({
                success: true,
                message: 'User ID is valid.'
            });
    })
});

module.exports = router;