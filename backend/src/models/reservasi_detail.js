const { DataTypes } = require('sequelize');

let ReservasiDetail; // Inisialisasi variabel model

const defineReservasiDetailModel = (sequelize) => {
    ReservasiDetail = sequelize.define('ReservasiDetail', {
        idDetail: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        idReservasi: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        namaPenumpang: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        idKursi: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'reservasidetail',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return ReservasiDetail;
};

module.exports = defineReservasiDetailModel;