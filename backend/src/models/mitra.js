const { DataTypes } = require('sequelize');

let Mitra; // Inisialisasi variabel model

const defineMitraModel = (sequelize) => {
  Mitra = sequelize.define('Mitra', {
    idMitra: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    logo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telephone: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
  }, {
    tableName: 'Mitra',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Mitra;
};

module.exports = defineMitraModel;