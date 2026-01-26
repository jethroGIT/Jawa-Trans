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
db.Tipe_Bus = require('./tipe_bus')(sequelize, DataTypes);
db.Fasilitas = require('./fasilitas')(sequelize, DataTypes);
db.Bus_Fasilitas = require('./bus_fasilitas')(sequelize, DataTypes);
db.Jadwal = require('./jadwal')(sequelize, DataTypes);
db.Reservasi = require('./reservasi')(sequelize, DataTypes);
db.Reservasi_Detail = require('./reservasi_detail')(sequelize, DataTypes);
db.Foto_Bus = require('./foto_bus')(sequelize, DataTypes);
db.Kursi = require('./kursi')(sequelize, DataTypes);

// Mitra -||---<- User ->|---||- Role
db.Mitra.hasMany(db.User, {
    foreignKey: 'idMitra',
    as: 'user'
});

db.User.belongsTo(db.Mitra, {
    foreignKey: 'idMitra',
    as: 'mitra'
})

db.User.belongsTo(db.Role, {
    foreignKey: 'idRole',
    as: 'role'
});

db.Role.hasMany(db.User, {
    foreignKey: 'idRole',
    as: 'user'
});


// Tipe Bus -||---|<- Bus_Fasilitas ->|---||- Fasilitas
db.Tipe_Bus.belongsToMany(db.Fasilitas, {
    through: db.Bus_Fasilitas,
    foreignKey: 'idTipe',
    otherKey: 'idFasilitas',
    as: 'fasilitas'
});

db.Fasilitas.belongsToMany(db.Tipe_Bus, {
    through: db.Bus_Fasilitas,
    foreignKey: 'idFasilitas',
    otherKey: 'idTipe',
    as: 'tipe_bus'
});


// Bus ->|---||- Tipe_Bus
db.Tipe_Bus.hasMany(db.Bus, {
    foreignKey: 'idTipe',
    as: 'bus'
});

db.Bus.belongsTo(db.Tipe_Bus, {
    foreignKey: 'idTipe',
    as: 'tipe_bus'
});


// Terminal -||---|<- Jadwal ->|---||- Bus
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

// User -||---|<- Reservasi ->|---||- Jadwal
db.User.hasMany(db.Reservasi, {
    foreignKey: 'idUser',
    as: 'reservasi'
});

db.Reservasi.belongsTo(db.User, {
    foreignKey: 'idUser',
    as: 'user'
});

db.Jadwal.hasMany(db.Reservasi, {
    foreignKey: 'idJadwal',
    as: 'reservasi'
});

db.Reservasi.belongsTo(db.Jadwal, {
    foreignKey: 'idJadwal',
    as: 'jadwal'
});


// Mitra -||---|<- Tipe Bus -||---|<- Foto_Bus
db.Mitra.hasMany(db.Tipe_Bus, {
    foreignKey: 'idMitra',
    as: 'tipe_bus'
});

db.Tipe_Bus.belongsTo(db.Mitra, {
    foreignKey: 'idMitra',
    as: 'mitra'
});

db.Tipe_Bus.hasMany(db.Foto_Bus, {
    foreignKey: 'idTipe',
    as: 'foto_bus'
});

db.Foto_Bus.belongsTo(db.Tipe_Bus, {
    foreignKey: 'idTipe',
    as: 'tipe_bus'
});


// Reservasi --||---|<- Reservasi Detail
db.Reservasi.hasMany(db.Reservasi_Detail, {
    foreignKey: 'idReservasi',
    as: 'reservasi_detail'
});

db.Reservasi_Detail.belongsTo(db.Reservasi, {
    foreignKey: 'idReservasi',
    as: 'reservasi'
});


// Bus --||---|<- Kursi
db.Bus.hasMany(db.Kursi, {
    foreignKey: 'idBus',
    as: 'kursi'
});

db.Kursi.belongsTo(db.Bus, {
    foreignKey: 'idBus',
    as: 'bus'
});

// Kursi --||---|<- Reservasi_Detail
db.Kursi.hasMany(db.Reservasi_Detail, {
    foreignKey: 'idKursi',
    as: 'reservasi_detail'
});

db.Reservasi_Detail.belongsTo(db.Kursi, {
    foreignKey: 'idKursi',
    as: 'kursi'
});


module.exports = db;