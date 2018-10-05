'use strict';
module.exports = (sequelize, DataTypes) => {
  const stats = sequelize.define('stats', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    player_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'player',
        key: 'id'
      }
    },
    season: DataTypes.STRING,
    mode: DataTypes.STRING,
    score: DataTypes.STRING,
    wins: DataTypes.STRING,
    top10: DataTypes.STRING,
    kd: DataTypes.STRING,
    matches: DataTypes.STRING,
    kills: DataTypes.STRING,
    win_percentage: DataTypes.DECIMAL(15, 2)
  }, {});
  stats.associate = function(models) {
    // associations can be defined here
  };
  return stats;
};