const mitraService = require('../services/mitraService');

const gettAllMitra = async (req, res) => {
    try {
        const mitra = await mitraService.gettAllMitra();
        return res.status(200).json({
            success: true,
            data: mitra
        })
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
        const mitra = await mitraService.getMitraById(id);
        return res.status(200).json({
            success: true,
            data: mitra
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    };
};

const store = async (req, res) => {
    const { logo, nama, alamat, telephone, email } = req.body;
    try {
        const mitra = await mitraService.createMitra({ logo, nama, alamat, telephone, email });
        return res.status(200).json({
            success: true,
            data: mitra
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const update = async(req, res) => {
    const { id } = req.params;
    const { logo, nama, alamat, telephone, email } = req.body;
    try {
        const mitra = await mitraService.updateMitra({ id, logo, nama, alamat, telephone, email });
        return res.status(200).json({
            success: true,
            message: 'Mitra berhasil diupdate!',
            data: mitra
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
        const mitra = await mitraService.destroyMitra(id);
    } catch(error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};


module.exports = {
    gettAllMitra,
    show,
    store,
    update,
    destroy
}