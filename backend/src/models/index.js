const sequelize = require('../config/database');
const { DataTypes, Sequelize } = require('sequelize');

const db = {};

db.sequelize = sequelize;  // Koneksi database
db.Sequelize = Sequelize; // Kelas Sequelize

// Models - Only NEW structure
db.Role = require('./role')(sequelize, DataTypes);
db.Customer = require('./customer')(sequelize, DataTypes);
db.Employee = require('./employee')(sequelize, DataTypes);
db.Mitra = require('./mitra')(sequelize, DataTypes);
db.SuperAdmin = require('./superAdmin')(sequelize, DataTypes);
db.Terminal = require('./terminal')(sequelize, DataTypes);
db.Bus = require('./bus')(sequelize, DataTypes);
db.Jenis_Kendaraan = require('./jenis_kendaraan')(sequelize, DataTypes);
db.Fasilitas = require('./fasilitas')(sequelize, DataTypes);
db.Bus_Fasilitas = require('./bus_fasilitas')(sequelize, DataTypes);
db.Jadwal = require('./jadwal')(sequelize, DataTypes);
db.Reservasi = require('./reservasi')(sequelize, DataTypes);
db.Reservasi_Detail = require('./reservasi_detail')(sequelize, DataTypes);
db.Foto_Bus = require('./foto_bus')(sequelize, DataTypes);

// ============================================
// RELATIONS - NEW DATABASE STRUCTURE
// ============================================

// Employee Relations
// Employee ->|---||- Mitra
db.Mitra.hasMany(db.Employee, {
    foreignKey: 'idMitra',
    as: 'employee'
});

db.Employee.belongsTo(db.Mitra, {
    foreignKey: 'idMitra',
    as: 'mitra'
});

// Employee ->|---||- Role
db.Employee.belongsTo(db.Role, {
    foreignKey: 'idRole',
    as: 'role'
});

db.Role.hasMany(db.Employee, {
    foreignKey: 'idRole',
    as: 'employee'
});

// Jenis_Kendaraan Relations
// Jenis_Kendaraan -||---|<- Bus_Fasilitas ->|---||- Fasilitas
db.Jenis_Kendaraan.belongsToMany(db.Fasilitas, {
    through: db.Bus_Fasilitas,
    foreignKey: 'idTipe',
    otherKey: 'idFasilitas',
    as: 'fasilitas'
});

db.Fasilitas.belongsToMany(db.Jenis_Kendaraan, {
    through: db.Bus_Fasilitas,
    foreignKey: 'idFasilitas',
    otherKey: 'idTipe',
    as: 'jenis_kendaraan'
});

// Bus ->|---||- Jenis_Kendaraan
db.Jenis_Kendaraan.hasMany(db.Bus, {
    foreignKey: 'idTipe',
    as: 'bus'
});

db.Bus.belongsTo(db.Jenis_Kendaraan, {
    foreignKey: 'idTipe',
    as: 'jenis_kendaraan'
});

// Jadwal Relations
// Terminal -||---|<- Jadwal
db.Terminal.hasMany(db.Jadwal, {
    foreignKey: 'titik_naik',
    as: 'jadwalKeberangkatan'
});

db.Terminal.hasMany(db.Jadwal, {
    foreignKey: 'titik_turun',
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

// Bus -||---|<- Jadwal
db.Bus.hasMany(db.Jadwal, {
    foreignKey: 'idBus',
    as: 'jadwal'
});

db.Jadwal.belongsTo(db.Bus, {
    foreignKey: 'idBus',
    as: 'bus'
});

// Reservasi Relations
// Customer -||---|<- Reservasi
db.Customer.hasMany(db.Reservasi, {
    foreignKey: 'idUser',
    as: 'reservasi'
});

db.Reservasi.belongsTo(db.Customer, {
    foreignKey: 'idUser',
    as: 'customer'
});

// Mitra Relations
// Mitra -||---|<- Jenis_Kendaraan -||---|<- Foto_Bus
db.Mitra.hasMany(db.Jenis_Kendaraan, {
    foreignKey: 'idMitra',
    as: 'jenis_kendaraan'
});

db.Jenis_Kendaraan.belongsTo(db.Mitra, {
    foreignKey: 'idMitra',
    as: 'mitra'
});

db.Jenis_Kendaraan.hasMany(db.Foto_Bus, {
    foreignKey: 'idTipe',
    as: 'foto_bus'
});

db.Foto_Bus.belongsTo(db.Jenis_Kendaraan, {
    foreignKey: 'idTipe',
    as: 'jenis_kendaraan'
});

// Reservasi Detail Relations
// Reservasi -||---|<- Reservasi_Detail
db.Reservasi.hasMany(db.Reservasi_Detail, {
    foreignKey: 'idReservasi',
    as: 'reservasi_detail'
});

db.Reservasi_Detail.belongsTo(db.Reservasi, {
    foreignKey: 'idReservasi',
    as: 'reservasi'
});

// Jadwal -||---|<- Reservasi_Detail
db.Jadwal.hasMany(db.Reservasi_Detail, {
    foreignKey: 'idJadwal',
    as: 'reservasi_detail'
});

db.Reservasi_Detail.belongsTo(db.Jadwal, {
    foreignKey: 'idJadwal',
    as: 'jadwal'
});

module.exports = db;