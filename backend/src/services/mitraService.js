const db = require('../models');
const Mitra = db.Mitra;

// Reusable Helper
const findMitraOrFail = async (id) => {
    const mitra = await Mitra.findByPk(id);
    if (!mitra) {
        throw new Error('Mitra tidak ditemukan!');
    }
    return mitra;
};

const checkDuplicateMitra = async (email, id = null) => {
    const existingMitra = await Mitra.findOne({
        where: { email }
    });
    if (existingMitra && existingMitra.idMitra != id) {
        throw new Error('Email sudah digunakan oleh mitra lain.');
    }
    return true;
};

const fieldValidation = ({ logo, nama, alamat, telephone, email }) => {
    if (!logo || !nama || !alamat || !telephone || !email) {
        throw new Error('Semua field wajib diisi!');
    }
    return true;
};


const gettAllMitra = async () => {
    return await Mitra.findAll();
};

const getMitraById = async (id) => {
    const mitra = await findMitraOrFail(id);

    return mitra;
};

const createMitra = async ({ logo, nama, alamat, telephone, email }) => {
    fieldValidation({ logo, nama, alamat, telephone, email });

    await checkDuplicateMitra(email);

    return await Mitra.create({ 
        logo, 
        nama, 
        alamat, 
        telephone, 
        email 
    });
};

const updateMitra = async({ id, logo, nama, alamat, telephone, email }) => {
    const mitra = await findMitraOrFail(id);

    fieldValidation({ logo, nama, alamat, telephone, email });

    await checkDuplicateMitra(email, id);
    
    return await mitra.update({
        logo,
        nama,
        alamat,
        telephone,
        email
    });
};

const destroyMitra = async (id) => {
    const mitra = await findMitraOrFail(id);

    return await mitra.destroy();
};

module.exports = {
    gettAllMitra,
    getMitraById,
    createMitra,
    updateMitra,
    destroyMitra
};