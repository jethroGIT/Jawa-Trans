const terminalService = require('../services/terminal.service');

const getAllTerminal = async (req, res) => {
    try{
        const terminal = await terminalService.getAllTerminal();
        return res.status(200).json({
            success: true,
            data: terminal
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
        const terminal = await terminalService.getTerminalById(id);
        return res.status(200).json({
            success: true,
            data: terminal
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
        const terminal = await terminalService.createTerminal(nama);
        return res.status(200).json({
            success: true,
            message: 'Terminal berhasil ditambahkan.'
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
        const updateTerminal = await terminalService.updateTerminal(id, nama);
        return res.status(200).json({
            success: true, 
            message: 'Terminal berhasil diperbarui!'
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
        const destroyTerminal = await terminalService.destroyTerminal(id);
        return res.status(200).json({
            success: true,
            message: 'Terminal berhasil dihapus!'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    };
};

module.exports = {
    getAllTerminal,
    show,
    store,
    update,
    destroy
};