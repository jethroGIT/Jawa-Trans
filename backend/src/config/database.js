const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('freedb_jawa-trans', 'freedb_mpls41', 'Tgy%4bdt!MP2gUU', {
  host: 'sql.freedb.tech',
  dialect: 'mysql',
  port: 3306,
});

module.exports = sequelize;
