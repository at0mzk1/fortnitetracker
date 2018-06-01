'use strict';

module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define('player', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        accountId: {
            type: DataTypes.STRING
        }
    });


    Player.associate = function (models) {
        models.player.hasMany(models.stat, {
            foreignKey: 'player_id',
            sourceKey: 'id'
        })
    }

    const players = Player.build();
    Player.sync();
    return Player;
};
