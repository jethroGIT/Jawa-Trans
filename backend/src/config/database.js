const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('freedb_jawa-trans', 'freedb_mpls41', 'Tgy%4bdt!MP2gUU', {
//   host: 'sql.freedb.tech',
//   dialect: 'mysql',
//   port: 3306,
// });

const sequelize = new Sequelize('new-jawatrans', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false  // Nonaktifkan logging SQL query ke console
});

module.exports = sequelize;
