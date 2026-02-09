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
    idTipe: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plat_nomor: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    kode_bus: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '0 = tidak aktif, 1 = aktif'
    }
  }, {
    tableName: 'bus',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Bus;
};

module.exports = defineBusModel;