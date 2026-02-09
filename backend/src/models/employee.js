const { DataTypes } = require('sequelize');

let Employee;

const defineEmployeeModel = (sequelize) => {
    Employee = sequelize.define('Employee', {
        idEmployee: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        idMitra: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idRole: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nama: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nik: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        alamat: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        telephone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            comment: '0 = tidak aktif, 1 = aktif'
        }
    }, {
        tableName: 'employee',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return Employee;
};

module.exports = defineEmployeeModel;
