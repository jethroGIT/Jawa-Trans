const db = require('../models');
const Terminal = db.Terminal;

const findTerminalOrFail = async (id) => {
    const terminal = await Terminal.findByPk(id);
    if (!terminal) {
        throw new Error('Terminal tidak ditemukan!')
    }
    return terminal;
};

const checkDuplicateTemrinal = async (nama) => {
    const existingTerminal = await Terminal.findOne({
        where: { nama }
    });
    if (existingTerminal) {
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

const createTerminal = async (nama) => {
    if (!nama) {
        throw new Error('Semua field wajib diiisi!')
    }

    await checkDuplicateTemrinal(nama);
    
    return await Terminal.create({ nama });
};

const updateTerminal = async (id, nama) => {
    if (!nama) {
        throw new Error ('Semua field wajib diisi!')
    }
    
    await checkDuplicateTemrinal(nama);

    const existingTerminal = await findTerminalOrFail(id);

    return await existingTerminal.update({
        nama
    });
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
