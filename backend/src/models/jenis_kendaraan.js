const { DataTypes } = require('sequelize');

let Jenis_Kendaraan;

const defineJenisKendaraanModel = (sequelize) => {
    Jenis_Kendaraan = sequelize.define('Jenis_Kendaraan', {
        idTipe: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        idMitra: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipe: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'jenis_kendaraan',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Jenis_Kendaraan;
};

module.exports = defineJenisKendaraanModel;
