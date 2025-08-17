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
        tanggal: {
            type: DataTypes.DATE,
            allowNull: true
        },
        titik_naik: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        titik_turun: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        jam_keberangkatan: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        jam_kedatangan: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        harga: {
            type: DataTypes.STRING(45),
            allowNull: true
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