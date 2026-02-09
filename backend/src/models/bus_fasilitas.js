const { DataTypes } = require('sequelize');

let Bus_Fasilitas;

const defineBusFasilitasModel = (sequelize) => {
    Bus_Fasilitas = sequelize.define('Bus_Fasilitas', {
        idTipe: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        idFasilitas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        tableName: 'bus_fasilitas',
        timestamps: false  // Disable timestamps for junction table
    });

    return Bus_Fasilitas;
};

module.exports = defineBusFasilitasModel;