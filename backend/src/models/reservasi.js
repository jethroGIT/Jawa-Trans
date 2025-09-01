const { DataTypes } = require('sequelize');

let Reservasi; // Inisialisasi variabel model

const defineReservasiModel = (sequelize) => {
    Reservasi = sequelize.define('Reservasi', {
        idReservasi: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idJadwal: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        penumpang: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        tableName: 'Reservasi',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Reservasi;
};

module.exports = defineReservasiModel;