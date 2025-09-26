const { removeTicks } = require('sequelize/lib/utils');
const kursiService = require('../services/kursi.service');

const getAllKursi = async (req, res) => {
    try {
        const kursi =  await kursiService.getAllKursi()
        return res.status(200).json({
            success: true,
            data: kursi
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    };
};

const getKursiByIdBus = async (req, res) => {
    const { idBus } = req.params;
    try {
        const kursi = await kursiService.getKursiByIdBus(idBus);
        return res.status(200).json({
            success: true,
            data: kursi
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    };
};

const show = async (req, res) => {
    const { idBus, idKursi } = req.params;
    try {
        const kursi = await kursiService.getKursiById(idBus, idKursi);
        return res.status(200).json({
            success: true,
            data: kursi
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        })
    };
};

const store = async (req, res) => {
    const { idBus } = req.params;
    const { noKursi, tipe } = req.body; 
    try {
        const kursi = await kursiService.createKursi({ idBus, noKursi, tipe });
        return res.status(200).json({
            success: true,
            message: 'Kursi berhasil ditambahakan.'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    };
};

const update = async (req, res) => {
    const { idKursi, idBus } = req.params;
    const { noKursi, tipe } = req.body
    try {
        const kursi = await kursiService.updateKursi({ idKursi, idBus, noKursi, tipe });
        return res.status(200).json({
            success: true,
            message: 'Kursi berhasil diperbaharui.'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    };
};

const destroy = async (req, res) => {
    const { idKursi } = req.params;
    try {
        const kursi = await kursiService.destroyKursi(idKursi);
        return res.status(200).json({
            success: true,
            message: 'Kursi berhasil dihapus.'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    };
};

module.exports = {
    getAllKursi,
    getKursiByIdBus,
    show,
    store,
    update,
    destroy
};
