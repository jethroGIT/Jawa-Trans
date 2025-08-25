const db = require('../models');
const Fasilitas = db.Fasilitas;

const findFasilitasOrFail = async (id) => {
    const fasilitas = await Fasilitas.findByPk(id);
    if (!fasilitas) {
        throw new Error('Fasilitas tidak ditemukan.')
    }
    return fasilitas
};

const checkDuplicateFasilitas = async (nama, id = null) => {
    const existingFasilitas = await Fasilitas.findOne({
        where: { nama }
    });

    if (existingFasilitas && existingFasilitas.idFasilitas != id) {
        throw new Error('Fasilitas sudah ada!')
    }

    return true;
};


const getAllFasilitas = async () => {
    return await Fasilitas.findAll();
};

const getFasilitasById = async (id) => {
    const fasilitas = await findFasilitasOrFail(id);

    return fasilitas;
};

const createFasilitas = async (nama) => {
    if (!nama) {
        throw new Error('Semua field wajib diisi!')
    }

    await checkDuplicateFasilitas(nama);

    return await Fasilitas.create({ nama });
};

const updateFasilitas = async (id, nama) => {
    const existingFasilitas = await findFasilitasOrFail(id);

    if (!nama) {
        throw new Error('Semua field wajib diisi!')
    }

    await checkDuplicateFasilitas(nama, id);

    return await existingFasilitas.update({ nama });
};

const destroyFasilitas = async (id) => {
    const existingFasilitas = await findFasilitasOrFail(id)
    
    return await existingFasilitas.destroy();
};

module.exports = {
    getAllFasilitas,
    getFasilitasById,
    createFasilitas,
    updateFasilitas,
    destroyFasilitas
}