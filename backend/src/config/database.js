const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Jawa-Trans', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
