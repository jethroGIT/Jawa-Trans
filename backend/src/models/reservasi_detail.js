const { DataTypes } = require('sequelize');

let ReservasiDetail; // Inisialisasi variabel model

const defineReservasiDetailModel = (sequelize) => {
    ReservasiDetail = sequelize.define('ReservasiDetail', {
        idJadwal: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            comment: 'Referensi ke jadwal perjalanan'
        },
        idReservasi: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            comment: 'Referensi ke reservasi header'
        },
        noKursi: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            comment: 'Nomor kursi yang dipesan'
        },
        namaPenumpang: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Nama penumpang untuk kursi ini'
        },
    }, {
        tableName: 'reservasidetail',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        comment: 'Tabel detail reservasi. Satu baris = satu penumpang di satu kursi. Composite key = (idJadwal, idReservasi, noKursi)'
    });

    return ReservasiDetail;
};

module.exports = defineReservasiDetailModel;