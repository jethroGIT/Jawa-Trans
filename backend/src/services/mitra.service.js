const db = require('../models');
const Mitra = db.Mitra;
const fs = require('fs').promises;
const path = require('path');


// Reusable Helper
const findMitraOrFail = async (id) => {
    const mitra = await Mitra.findByPk(id);
    if (!mitra) {
        throw new Error('Mitra tidak ditemukan!');
    }
    return mitra;
};

const checkDuplicateMitra = async ({ nama, telephone, email, id = null }) => {
    const existingMitra = await Mitra.findOne({
        where: { nama }
    })
    const existingPhone = await Mitra.findOne({
        where: { telephone }
    });
    const existingMail = await Mitra.findOne({
        where: { email }
    });
    if (existingMitra && existingMitra.idMitra != id) {
        throw new Error('Nama mitra sudah digunakan oleh mitra lain')
    }
    if (existingPhone && existingPhone.idMitra != id) {
        throw new Error('Nomor telephone sudah digunakan oleh mitra lain.')
    }
    if (existingMail && existingMail.idMitra != id) {
        throw new Error('Email sudah digunakan oleh mitra lain.');
    }
    return true;
};

const fieldValidation = ({ logo, nama, alamat, telephone, email }) => {
    if (!logo || !nama || !alamat || !telephone || !email) {
        throw new Error(logo);
    }
    return true;
};

const urlLogoMitra = (req, mitras) => {
    const baseURL = `${req.protocol}://${req.get('host')}`;
    if (Array.isArray(mitras)) {
        return mitras.map(mitra => ({
            ...mitra.toJSON(),
            logoURL: mitra.logo
                ? `${baseURL}/uploads/mitra/${mitra.logo}`
                : null
        }));
    } else {
        return {
            ...mitras.toJSON(),
            logoURL: mitras.logo
                ? `${baseURL}/uploads/mitra/${mitras.logo}`
                : null
        };
    }
}


const gettAllMitra = async (req) => {
    const mitra = await Mitra.findAll();

    const mitraWithLogoURL = urlLogoMitra(req, mitra);

    return mitraWithLogoURL;
};

const getMitraById = async (req, id) => {
    const mitra = await findMitraOrFail(id);

    const mitraWithLogoURL = urlLogoMitra(req, mitra);

    return mitraWithLogoURL;
};

const createMitra = async ({ logo, nama, alamat, telephone, email }) => {
    fieldValidation({ logo, nama, alamat, telephone, email });

    await checkDuplicateMitra({ nama, telephone, email });

    return await Mitra.create({
        logo,
        nama,
        alamat,
        telephone,
        email
    });
};

const updateMitra = async ({ id, logo, nama, alamat, telephone, email }) => {
    const mitra = await findMitraOrFail(id);

    fieldValidation({ logo, nama, alamat, telephone, email });

    await checkDuplicateMitra({ nama, telephone, email, id });

    if (logo && mitra.logo) {
        const oldLogoPath = path.join(__dirname, '../uploads/mitra/', mitra.logo);
        await fs.unlink(oldLogoPath);
    }

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