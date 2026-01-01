const { DataTypes } = require('sequelize');

let Tipe_Bus; 

const defineTipeBusModel = (sequelize) => {
    Tipe_Bus = sequelize.define('Tipe_Bus', {
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
        },
        kapasitas: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'tipe_bus',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Tipe_Bus;
};

module.exports = defineTipeBusModel;