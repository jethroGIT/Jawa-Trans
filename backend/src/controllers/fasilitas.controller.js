const fasilitasService = require('../services/fasilitas.service');

const getAllFasilitas = async (req, res) => {
    try {
        const fasilitas = await fasilitasService.getAllFasilitas();
        return res.status(200).json({
            success: true,
            data: fasilitas
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
        const fasilitas = await fasilitasService.getFasilitasById(id);
        return res.status(200).json({
            success: true,
            data: fasilitas
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    };
};

const store = async (req, res) => {
    const { nama } = req.body;
    try {
        const fasilitas = await fasilitasService.createFasilitas(nama);
        return res.status(200).json({
            success: false,
            message: 'Fasilitas berhasil ditambahkan.'
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
    const { nama } = req.body;
    try {
        const fasilitas = await fasilitasService.updateFasilitas(id, nama)
        return res.status(200).json({
            success: true,
            message: 'Fasilitas berhasil diperbarui.'
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
        const fasilitas = await fasilitasService.destroyFasilitas(id);
        return res.status(200).json({
            success: true,
            message: 'Fasilitas berhasil dihapus'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

module.exports = {
    getAllFasilitas,
    show,
    store,
    update,
    destroy
};
