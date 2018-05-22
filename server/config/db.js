module.exports = {
    username: process.env.userId,
    password: process.env.password,
    database: process.env.database,
    host: process.env.host,
    port: 3306,
    dialect: 'mysql',
    jwtSecret: "739D3383D4B330F05E0ECB937DEABEA2FA5F9927DD0BFEDC411B15343EBE05CC"
};