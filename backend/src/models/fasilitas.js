const { DataTypes } = require('sequelize');

let Fasilitas; // Inisialisasi variabel model

const defineFasilitasModel = (sequelize) => {
  Fasilitas = sequelize.define('Fasilitas', {
    idFasilitas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
  }, {
    tableName: 'Fasilitas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Fasilitas;
};

module.exports = defineFasilitasModel;