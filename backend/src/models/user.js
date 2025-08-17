const { DataTypes } = require('sequelize');

let User; // Inisialisasi variabel model

const defineUserModel = (sequelize) => {
  User = sequelize.define('User', {
    idUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    idRole: {
        type: DataTypes.INTEGER,
        allowNull: false
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
        type: DataTypes.STRING(100),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'User',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return User;
};

module.exports = defineUserModel;
