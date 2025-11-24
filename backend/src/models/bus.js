const { DataTypes } = require('sequelize');

let Bus; // Inisialisasi variabel model

const defineBusModel = (sequelize) => {
  Bus = sequelize.define('Bus', {
    idBus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    idMitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode_bus: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'Bus',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Bus;
};

module.exports = defineBusModel;