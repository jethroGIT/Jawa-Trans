const sequelize = require('../config/database');
const { DataTypes, Sequelize } = require('sequelize');

const db = {};

db.sequelize = sequelize;  // Koneksi database
db.Sequelize = Sequelize; // Kelas Sequelize

db.Role = require('./role')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.Mitra = require('./mitra')(sequelize, DataTypes);
db.Terminal = require('./terminal')(sequelize, DataTypes);
db.Bus = require('./bus')(sequelize, DataTypes);
db.Fasilitas = require('./fasilitas')(sequelize, DataTypes);
db.Bus_Fasilitas = require('./bus_fasilitas')(sequelize, DataTypes);
db.methodPayment = require('./methodPayment')(sequelize, DataTypes);
db.Jadwal = require('./jadwal')(sequelize, DataTypes);

// User ->|---||- Role
db.Role.hasMany(db.User, {
    foreignKey: 'idRole',
    as: 'user'
});

db.User.belongsTo(db.Role, {
    foreignKey: 'idRole',
    as: 'role'
});


// Bus -||---|<- Bus_Fasilitas ->|---||- Fasilitas
db.Bus.belongsToMany(db.Fasilitas, {
    through: db.Bus_Fasilitas,
    foreignKey: 'idBus',
    otherKey: 'idFasilitas',
    as: 'fasilitas'
});

db.Fasilitas.belongsToMany(db.Bus, {
    through: db.Bus_Fasilitas,
    foreignKey: 'idFasilitas',
    otherKey: 'idbus',
    as: 'bus'
});

// Bus ->|---||- Mitra
db.Mitra.hasMany(db.Bus, {
    foreignKey: 'idMitra',
    as: 'bus'
});

db.Bus.belongsTo(db.Mitra, {
    foreignKey: 'idMitra',
    as: 'mitra'
});


// Temrinal -||---|<- Jadwal ->|---||- Bus
db.Terminal.hasMany(db.Jadwal, {
    foreignKey: 'titik_naik', // atau idTerminalNaik
    as: 'jadwalKeberangkatan'
});

db.Terminal.hasMany(db.Jadwal, {
    foreignKey: 'titik_turun', // atau idTerminalTurun
    as: 'jadwalKedatangan'
});

db.Jadwal.belongsTo(db.Terminal, {
    foreignKey: 'titik_naik',
    as: 'terminalNaik'
});

db.Jadwal.belongsTo(db.Terminal, {
    foreignKey: 'titik_turun', 
    as: 'terminalTurun'
});

db.Bus.hasMany(db.Jadwal, {
    foreignKey: 'idBus',
    as: 'jadwal'
});

db.Jadwal.belongsTo(db.Bus, {
    foreignKey: 'idBus',
    as: 'bus'
});

module.exports = db;