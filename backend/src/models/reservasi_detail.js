const { DataTypes } = require('sequelize');

let Reservasi_Detail; // Inisialisasi variabel model

const defineReservasiDetailModel = (sequelize) => {
    Reservasi_Detail = sequelize.define('Reservasi_Detail', {
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
        tableName: 'Reservasi_Detail',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Reservasi_Detail;
};

module.exports = defineReservasiDetailModel;