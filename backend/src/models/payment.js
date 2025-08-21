const { DataTypes } = require('sequelize');

let Payment; // Inisialisasi variabel model

const definePaymentModel = (sequelize) => {
    Payment = sequelize.define('Payment', {
        idPayment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        idReservasi: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idmethodPayment: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        totalBayar: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        waktuBayar: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'Payment',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Payment;
};

module.exports = definePaymentModel;