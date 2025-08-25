const { DataTypes } = require('sequelize');

let Jadwal; // Inisialisasi variabel model

const defineJadwalModel = (sequelize) => {
    Jadwal = sequelize.define('Jadwal', {
        idJadwal: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        idBus: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        titik_naik: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        titik_turun: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tanggal_keberangkatan: {
            type: DataTypes.DATE,
            allowNull: false
        },
        jam_keberangkatan: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        tanggal_kedatangan: {
            type: DataTypes.DATE,
            allowNull: false
        },
        jam_kedatangan: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        harga: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        tableName: 'Jadwal',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Jadwal;
};

module.exports = defineJadwalModel;