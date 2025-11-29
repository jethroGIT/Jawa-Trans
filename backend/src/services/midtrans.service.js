const db = require('../models');
const Reservasi = db.Reservasi;
const Reservasi_Detail = db.Reservasi_Detail;
const Payment = db.Payment;
const midtrans = require('../config/midtrans');
const { where } = require('sequelize');

// Recurring (opsional)
const processRecurring = async (payload) => {
    console.log("Recurring notification:", payload);
    return true;
};

// Pay account (optional)
const processPayAccount = async (payload) => {
    console.log("Pay Account notification:", payload);
    return true;
};

const createPayment = async (orderId, amount, customer) => {
    console.log(midtrans);
    console.log("Functions:", Object.keys(midtrans));

    const parameter = {
        payment_type: "bank_transfer",
        transaction_details: {
            order_id: orderId,
            gross_amount: amount
        },
        customer_details: {
            first_name: customer.name,
            email: customer.email,
            phone: customer.phone
        },
        bank_transfer: {
            bank: "bca"
        }
    };

    return await midtrans.charge(parameter);
};

const updatePaymentStatus = async (callbackData) => {
    const {
        order_id,
        transaction_status,
        fraud_status,
        payment_type,
        gross_amount
    } = callbackData;

    // Cari reservasi berdasarkan order_id yg sudah dikonversi ke integer
    const reservasiId = parseInt(order_id, 10);
    const reservasi = await Reservasi.findOne({
        where: { idReservasi: reservasiId }
    });

    if (!reservasi) {
        throw new Error('Reservasi tidak ditemukan untuk order_id: ' + order_id);
    }

    // Tentukan status internal berdasarkan status midtrans
    let newStatus = '';

    if (transaction_status === 'capture') {
        if (fraud_status === 'challenge') {
            newStatus = 'pending';
        } else if (fraud_status === 'accept') {
            newStatus = 'paid';
        }
    }
    else if (transaction_status === 'settlement') {
        newStatus = 'paid';
    }
    else if (transaction_status === 'cancel' || transaction_status === 'deny') {
        newStatus = 'failed';
    }
    else if (transaction_status === 'expire') {
        newStatus = 'expired';
    }
    else {
        newStatus = 'pending';
    }

    // Update reservasi
    await Reservasi_Detail.update(
        { status: newStatus },            
        { where: { idReservasi: reservasiId } }
    );


    return {
        order_id,
        newStatus
    };
}

module.exports = {
    processRecurring,
    processPayAccount,
    createPayment,
    updatePaymentStatus
};
