const paymentService = require('../services/payment.service');

const getAllPayment = async (req, res) => {
    try {
        const payment = await paymentService.getAllPayment();
        return res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

const show = async (req, res) => {
    const { id } = req.params;
    try {
        const payment  = await paymentService.getPaymentById(id);
        return res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const store = async (req, res) => {
    const { idReservasi, idmethodPayment, status, totalBayar, waktuBayar } = req.body;
    try {
        const payment = await paymentService.createPayment({ idReservasi, idmethodPayment, status, totalBayar, waktuBayar });
        return res.status(200).json({
            success: true,
            message:'Transaksi telah berhasil ditambahkan'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { idReservasi, idmethodPayment, status, totalBayar, waktuBayar } = req.body;
    try {
        const payment = await paymentService.updatePayment({ id, idReservasi, idmethodPayment, status, totalBayar, waktuBayar });
        return res.status(200).json({
            success: true,
            message: 'Transaki berhasil diperbaharui'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await paymentService.destroyPayment(id);
        return res.status(200).json({
            success: true,
            message: 'Transaki telah dihapus'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

module.exports = {
    getAllPayment,
    show,
    store,
    update,
    destroy
};