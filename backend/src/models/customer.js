const { DataTypes } = require('sequelize');

let Customer;

const defineCustomerModel = (sequelize) => {
    Customer = sequelize.define('Customer', {
        idUser: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        nama: {
            type: DataTypes.STRING(100),
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
        }
    }, {
        tableName: 'customer',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return Customer;
};

module.exports = defineCustomerModel;
