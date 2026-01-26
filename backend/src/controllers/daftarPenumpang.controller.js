const daftarPenumpangServices = require('../services/daftarPenumpang.services');

const getDaftarPenumpangById = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await daftarPenumpangServices.getDaftarPenumpangById(req, id);
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

module.exports = {
    getDaftarPenumpangById
};
