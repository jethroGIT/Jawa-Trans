const busService = require('../services/bus.service');

const getAllBus = async (req, res) => {
    try {
        const bus = await busService.getAllBus();
        return res.status(200).json({
            success: true,
            data: bus
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
        const bus = await busService.getBusById(id);
        return res.status(200).json({
            success: true,
            data: bus
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    };
};


const store = async (req, res) => {
    const { idMitra, kode_bus, nama, type, kapasitas, status, fasilitas } = req.body;
    try {
        const createBus = await busService.createBus({ idMitra, kode_bus, nama, type, kapasitas, status, fasilitas, fotos });
        return res.status(200).json({
            success: true,
            message: 'Bus berhasil ditambahkan.'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const update = async (req, res) => {
    const { id } = req.params;
    const { idMitra, kode_bus, nama, type, kapasitas, status, fasilitas } = req.body;
    try {
        const updateBus = await busService.updatebus({ id, idMitra, kode_bus, nama, type, kapasitas, status, fasilitas });
        return res.status(200).json({
            success: true,
            message: 'Bus berhasil diperbarui.'
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
        const deleteBus = await busService.destroyBus(id);
        return res.status(200).json({
            success: true,
            message: 'Bus berhasil dihapus'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

module.exports = {
    getAllBus,
    show, 
    store,
    update,
    destroy
};