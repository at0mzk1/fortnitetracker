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
        },
        platform: {
            type: DataTypes.STRING
        }
    });


    Player.associate = function (models) {
        models.player.hasMany(models.stat, {
            foreignKey: 'player_id',
            sourceKey: 'id'
        })

        models.player.belongsToMany(models.user, { as: 'users', through: 'dashboard', foreignKey: 'player_id', timestamps: false });
    }

    const players = Player.build();
    Player.sync();
    return Player;
};
