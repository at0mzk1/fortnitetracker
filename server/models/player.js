'use strict';
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('player', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    accountId: DataTypes.STRING,
    platform: DataTypes.STRING
  }, {});
  Player.associate = function(models) {
    models.player.hasMany(models.stats, {
      foreignKey: 'player_id',
      sourceKey: 'id'
    })
    models.player.belongsToMany(models.user, { as: 'users', through: 'dashboard', foreignKey: 'player_id', timestamps: false });
  };
  return Player;
};