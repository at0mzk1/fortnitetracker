'use strict';
var bcrypt = require('bcrypt-nodejs');
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userid: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  }, {
      timestamps: false,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        noAttributes: {
          attributes: { exclude: ['id', 'userid', 'password', 'email'] },
        },
        validatePassword: {
          attributes: { exclude: ['id', 'email', 'resetPasswordToken', 'resetPasswordExpires'] },
        }
      },
      hooks: {
        beforeSave: function (user, done) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        }
      }
    });
  user.associate = function(models) {
    models.user.belongsToMany(models.player, { as: 'players', through: 'dashboard', foreignKey: 'user_id', timestamps: false });
  };
  user.prototype.validPassword = function (password, callback) {
    bcrypt.compare(password, this.password, callback);
  }
  return user;
};