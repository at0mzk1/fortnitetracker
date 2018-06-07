'use strict';

const Models = require('./index.js');

module.exports = (sequelize, DataTypes) => {
    const Stat = sequelize.define('stat', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        player_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Models.player,
                key: 'id'
            }
        },
        season: {
            type: DataTypes.STRING
        },
        mode: {
            type: DataTypes.STRING
        },
        score: {
            type: DataTypes.STRING
        },
        wins: {
            type: DataTypes.STRING
        },
        top10: {
            type: DataTypes.STRING
        },
        kd: {
            type: DataTypes.STRING
        },
        matches: {
            type: DataTypes.STRING
        },
        kills: {
            type: DataTypes.STRING
        },
        win_percentage: {
            type: DataTypes.DECIMAL(15,2)
        }
    });

    const stats = Stat.build();
    Stat.sync();
    return Stat;
};
