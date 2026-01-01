const tipeBusServices = require('../services/tipeBus.services');

const getAllTipe = async (req, res) => {
    try {
        const data = await tipeBusServices.getAllTipe();
        return res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTipeByMitra = async (req, res) => {
    const { idMitra } = req.params;
    try {
        const data = await tipeBusServices.getTipeByMitra(idMitra);
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const show = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await tipeBusServices.getTipeBusById(id);
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const store = async (req, res) => {
    const { idMitra, tipe, kapasitas, fasilitas } = req.body;
    const fotos = req.files ? req.files.map(file => file.filename) : [];
    try {
        const data = await tipeBusServices.storeTipeBus({ idMitra, tipe, kapasitas, fasilitas, fotos });
        return res.status(200).json({
            success: true,
            message: 'Tipe bus berhasil ditambahkan'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { idMitra, tipe, kapasitas, fasilitas } = req.body;
    const fotos = req.files ? req.files.map(file => file.filename) : [];
    try {
        const data = await tipeBusServices.updateTipeBus({ id, idMitra, tipe,kapasitas, fasilitas, fotos });
        return res.status(200).json({
            success: true,
            message: 'Tipe bus berhasil diupdate'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await tipeBusServices.destroyTipeBus(id);
        return res.status(200).json({
            success: true,
            message: 'Tipe bus berhasil dihapus'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllTipe,
    getTipeByMitra,
    show,
    store,
    update,
    destroy
};