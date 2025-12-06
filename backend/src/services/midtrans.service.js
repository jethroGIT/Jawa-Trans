const db = require('../models');
const Reservasi = db.Reservasi;
const Reservasi_Detail = db.Reservasi_Detail;
const Payment = db.Payment;
const midtrans = require('../config/midtrans');
const { where } = require('sequelize');

function getMidtransTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Ambil offset timezone dalam menit → ubah ke format +0700
    const tzOffset = -now.getTimezoneOffset(); // WITA/WIB biasanya  -(-420) = +420
    const sign = tzOffset >= 0 ? "+" : "-";
    const tzHours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, "0");
    const tzMinutes = String(Math.abs(tzOffset) % 60).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${sign}${tzHours}${tzMinutes}`;
}


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

const createPayment = async (orderId, amount, customer, method) => {
    // console.log(midtrans);
    // console.log("Functions:", Object.keys(midtrans));

    let parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: amount
        },
        customer_details: {
            first_name: customer.name,
            email: customer.email,
            phone: customer.phone
        },
        custom_expiry: {
            order_time: getMidtransTime(),
            expiry_duration: 5,
            unit: "minute"
        }
    };

    if (method === "bca" || method === "bni" || method === "bri" || method === "mandiri") {
        parameter.payment_type = "bank_transfer";
        parameter.bank_transfer = { bank: method };
    }

    if (method === "qris") {
        parameter.payment_type = "qris",
            parameter.qris = { acquirer: "gopay" };
    }

    if (method === "gopay") {
        parameter.payment_type = "gopay";
        parameter.gopay = { enable_callback: true, callback_url: "https://bf3b27771188.ngrok-free.app/api/payment/finish" };
    }
    const response = await midtrans.charge(parameter);
    console.log("Midtrans charge response:", response);
    return response;
};

const updatePaymentStatus = async (callbackData) => {
    console.log("Midtrans callback data:", callbackData);
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
    await Reservasi.update(
        { status: newStatus },
        { where: { idReservasi: reservasiId } }
    );
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
