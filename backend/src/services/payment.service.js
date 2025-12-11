const db = require('../models');
const Payment = db.Payment;
const Reservasi = db.Reservasi;

const findPaymentOrFail = async (id) => {
    const payment = await Payment.findByPk(id, {
        include: [
            {
                model: Reservasi,
                as: 'reservasi'
            }
        ]
    });

    if (!payment) {
        throw new Error('Transaki tidak ditemukan!')
    }

    return payment;
};

const fieldValidation = ({ idReservasi, method, status, totalBayar, waktuBayar }) => {
    if (!idReservasi || !method || !status || !totalBayar || !waktuBayar ) {
        throw new Error('Semua field wajib diisi.')
    }
    return true;
};

const getAllPayment = async () => {
    return await Payment.findAll({
        include: [
            {
                model: Reservasi,
                as: 'reservasi'
            }
        ]
    });
};

const getPaymentById = async (id) => {
    return await Payment.findByPk(id, {
        include: [
            {
                model: Reservasi,
                as: 'reservasi'
            }
        ]
    });
};

const createPayment = async ({ idReservasi, method, status, totalBayar, waktuBayar }) => {
    fieldValidation({ idReservasi, method, status, totalBayar, waktuBayar })

    return await Payment.create({
        idReservasi,
        method,
        status,
        totalBayar,
        waktuBayar
    });
};

const updatePayment = async ({ id, idReservasi, method, status, totalBayar, waktuBayar }) => {
    fieldValidation({ idReservasi, method, status, totalBayar, waktuBayar })

    const existingPayment = await findPaymentOrFail(id);

    return await existingPayment.update({
        idReservasi,
        method,
        status,
        totalBayar,
        waktuBayar
    });
};

const destroyPayment = async (id) => {
    const existingPayment = await findPaymentOrFail(id);

    return await existingPayment.destroy();
};

module.exports = ({ 
    getAllPayment,
    getPaymentById,
    createPayment,
    updatePayment,
    destroyPayment
});