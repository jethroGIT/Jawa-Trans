const { DataTypes } = require('sequelize');

let SuperAdmin;

const defineSuperAdminModel = (sequelize) => {
    SuperAdmin = sequelize.define('SuperAdmin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'superAdmin',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return SuperAdmin;
};

module.exports = defineSuperAdminModel;
