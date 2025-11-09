const { DataTypes } = require('sequelize');
const { all } = require('../routes/api');

let Foto_Bus; // Inisialisasi variabel model

const defineFotoBusModel = (sequelize) => {
  Foto_Bus = sequelize.define('Foto_Bus', {
    idFoto_Bus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    idBus: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
  }, {
    tableName: 'Foto_Bus',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Foto_Bus;
};

module.exports = defineFotoBusModel;