const { DataTypes } = require('sequelize');

let Bus_Fasilitas;

const defineBusFasilitasModel = (sequelize) => {
    Bus_Fasilitas = sequelize.define('Bus_Fasilitas', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        idBus: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idFasilitas: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Bus_Fasilitas',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Bus_Fasilitas;
};

module.exports = defineBusFasilitasModel;