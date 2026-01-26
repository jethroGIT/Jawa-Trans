const db = require('../models');
const Terminal = db.Terminal;

const findTerminalOrFail = async (id) => {
    const terminal = await Terminal.findByPk(id);
    if (!terminal) {
        throw new Error('Terminal tidak ditemukan!')
    }
    return terminal;
};

const checkDuplicateTerminal = async (nama, id = null) => {
    const existingTerminal = await Terminal.findOne({
        where: { nama }
    });
    if (existingTerminal && existingTerminal.idTerminal != id) {
        throw new Error('Terminal sudah ada!')
    }
    return true;
};


const getAllTerminal = async () => {
    return Terminal.findAll();
};


const getTerminalById = async (id) => {
    const terminal = await findTerminalOrFail(id);

    return terminal;
};

const createTerminal = async (kota, nama) => {
    if (!nama && !kota) {
        throw new Error('Semua field wajib diiisi!')
    }

    await checkDuplicateTerminal(nama);
    
    return await Terminal.create({ kota, nama });
};

const updateTerminal = async (id, kota, nama) => {
    const existingTerminal = await findTerminalOrFail(id);

    if (!nama && !kota) {
        throw new Error ('Semua field wajib diisi!')
    }
    
    await checkDuplicateTerminal(nama, id);

    return await existingTerminal.update({ kota, nama });
};


const destroyTerminal = async (id) => {
    const existingTerminal = await findTerminalOrFail(id);

    return await existingTerminal.destroy();
};


module.exports = {
    getAllTerminal,
    getTerminalById,
    createTerminal,
    updateTerminal,
    destroyTerminal
};
