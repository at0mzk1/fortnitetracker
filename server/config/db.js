const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
    username: process.env.userId,
    password: process.env.password,
    database: process.env.database,
    host: process.env.host,
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: Op, // use Sequelize.Op
    jwtSecret: process.env.secret
};