'use strict';
var bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userid: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        }
    }, {
            timestamps: false,
            hooks: {
                beforeCreate: function (user, done) {
                    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
                }                
            }
        });
    
    User.associate = function (models) {
        models.user.belongsToMany(models.player, { as: 'players', through: 'dashboard', foreignKey: 'user_id', timestamps: false });
    }

    User.prototype.validPassword = function (password, callback) {
        bcrypt.compare(password, this.password, callback);
        // return bcrypt.compareSync(password, this.password, callback);
    }

    const users = User.build();
    User.sync();
    return User;
};
