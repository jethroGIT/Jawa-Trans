const { DataTypes } = require('sequelize');

let methodPayment;

const defineMethodPaymentModel = (sequelize) => {
    methodPayment = sequelize.define('methodPayment', {
        idmethodPayment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nama: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        tableName: 'methodPayment',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return methodPayment;
};

module.exports = defineMethodPaymentModel;