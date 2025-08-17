const methodPaymentService = require('../services/methodPayment.service');

const getAllMethodPayment = async (req, res) => {
    try {
        const methodPayment = await methodPaymentService.getAllMethodPayment();
        return res.status(200).json({
            success: true,
            data: methodPayment
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
        const methodPayment = await methodPaymentService.getMethodPaymentById(id);
        return res.status(200).json({
            success: true,
            data: methodPayment
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    };
};

const store = async (req, res) => {
    const { nama, code } = req.body;
    try {
        const methodPayment = await methodPaymentService.createMethodPayment(nama, code);
        return res.status(200).json({
            success: true,
            message: 'Method Payment berhasil ditambahkan'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const update = async (req, res) => {
    const { id } = req.params;
    const { nama, code } = req.body;
    try {
        const methodPayment = await methodPaymentService.updateMethodPayment({ id, nama, code });
        return res.status(200).json({
            success: true,
            message: 'Method Payment berhasil diperbaharui'
        })
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
        const methodPayment = await methodPaymentService.destroyMethodPayment(id);
        return res.status(200).json({
            success: true,
            message: 'Method Payment berhasil dihapus'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

module.exports = {
    getAllMethodPayment,
    show,
    store,
    update,
    destroy
};