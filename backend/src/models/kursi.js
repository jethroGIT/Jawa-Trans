const { DataTypes } = require('sequelize');

let Kursi; // Inisialisasi variabel model

const defineKursiModel = (sequelize) => {
    Kursi = sequelize.define('Kursi', {
        idKursi: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        idBus: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        noKursi: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        tipe: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        tableName: 'Kursi',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Kursi;
};

module.exports = defineKursiModel;