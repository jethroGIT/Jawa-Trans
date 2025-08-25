const jadwalService = require('../services/jadwal.service');

const getAllJadwal = async (req, res) => {
    try {
        const jadwal = await jadwalService.getAllJadwal();
        return res.status(200).json({
            success: true,
            data: jadwal
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
        const jadwal = await jadwalService.getJadwalById(id);
        return res.status(200).json({
            success: true,
            data: jadwal
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    };
};

const store = async (req, res) => {
    const { idBus, titik_naik, titik_turun, tanggal_keberangkatan, jam_keberangkatan, tanggal_kedatangan, jam_kedatangan, harga } = req.body;
    try {
        const jadwal = await jadwalService.createJadwal({ idBus, titik_naik, titik_turun, tanggal_keberangkatan, jam_keberangkatan, tanggal_kedatangan, jam_kedatangan, harga });
        return res.status(200).json({
            success: true,
            message: 'Jadwal berhasil ditambahkan'
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
    const { idBus, tanggal, titik_naik, titik_turun, jam_keberangkatan, jam_kedatangan, harga } = req.body;
    try {
        const jadwal = await jadwalService.updateJadwal({ id, idBus, tanggal, titik_naik, titik_turun, jam_keberangkatan, jam_kedatangan, harga });
        return res.status(200).json({
            success: true,
            message: 'Jadwal berhasil diperbaharui'
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
        const jadwal = await jadwalService.destroyJadwal(id);
        return res.status(200).json({
            success: true,
            message: 'Jadwal berhasil dihapus'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

module.exports = {
    getAllJadwal,
    show,
    store,
    update,
    destroy
};