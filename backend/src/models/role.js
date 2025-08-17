const { DataTypes } = require('sequelize');

let Role; // Inisialisasi variabel model

const defineRoleModel = (sequelize) => {
  Role = sequelize.define('Role', {
    idRole: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: 'Role',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Role;
};

module.exports = defineRoleModel;
