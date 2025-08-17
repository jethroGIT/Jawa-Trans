const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Jawa-Trans', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
