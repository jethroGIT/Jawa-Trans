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
        noKursi: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        tableName: 'ReservasiDetail',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return ReservasiDetail;
};

module.exports = defineReservasiDetailModel;