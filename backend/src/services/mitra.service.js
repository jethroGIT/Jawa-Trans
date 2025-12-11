const db = require('../models');
const Mitra = db.Mitra;
const fs = require('fs');
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
        throw new Error('Semua field wajib diisi');
    }
    return true;
};

const urlLogoMitra = (req, mitras) => {
    const baseURL = `${req.protocol}://${req.get('host')}`;

    // Function untuk memproses satu mitra (baik instance maupun plain object)
    const processSingle = (mitra) => {
        if (!mitra) return null;

        // Jika instance Sequelize → pakai toJSON()
        // Jika plain object → pakai apa adanya
        const data = typeof mitra.toJSON === "function" ? mitra.toJSON() : mitra;

        return {
            ...data,
            logoURL: data.logo 
                ? `${baseURL}/uploads/mitra/${data.logo}` 
                : null
        };
    };

    // Jika array → map tiap item
    if (Array.isArray(mitras)) {
        return mitras.map(item => processSingle(item));
    }

    // Jika single object
    return processSingle(mitras);
};



const hapusFileStorage = (fileLogo) => {
    if (!fileLogo) return;
    const filePath = path.join(__dirname, '../uploads/mitra', fileLogo);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted foto: ${fileLogo}`);
    }
}


const gettAllMitra = async (req) => {
    const mitra = await Mitra.findAll();

    return urlLogoMitra(req, mitra);
};

const getMitraById = async (req, id) => {
    const mitra = await findMitraOrFail(id);

    return urlLogoMitra(req, mitra);
};

const createMitra = async ({ logo, nama, alamat, telephone, email }) => {
    try {
        fieldValidation({ logo, nama, alamat, telephone, email });

        await checkDuplicateMitra({ nama, telephone, email });

        return await Mitra.create({
            logo,
            nama,
            alamat,
            telephone,
            email
        });
    } catch (error) {
        hapusFileStorage(logo);

        throw error;
    }
};

const updateMitra = async ({ id, logo, nama, alamat, telephone, email }) => {
    const mitra = await findMitraOrFail(id);

    try {
        fieldValidation({ logo, nama, alamat, telephone, email });

        await checkDuplicateMitra({ nama, telephone, email, id });

        if (logo && mitra.logo && logo !== mitra.logo) {
            hapusFileStorage(mitra.logo);
        }

        await mitra.update({
            logo,
            nama,
            alamat,
            telephone,
            email
        });

        return mitra;
    } catch (error) {
        if (mitra) { hapusFileStorage(logo); }

        throw error;
    }
};

const destroyMitra = async (id) => {
    const mitra = await findMitraOrFail(id);

    hapusFileStorage(mitra.logo);

    return await mitra.destroy();
};

module.exports = {
    gettAllMitra,
    getMitraById,
    createMitra,
    updateMitra,
    destroyMitra,
    urlLogoMitra
};