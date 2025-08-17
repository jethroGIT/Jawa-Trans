const db = require('../models');

const MethodPayment = db.methodPayment;

// Reusable Helper
const findOrFail = async (id) => {
    const methodPayment = await MethodPayment.findByPk(id);
    
    if (!methodPayment) {
        throw new Error('Method Payment tidak ditemukan.')
    }

    return methodPayment;
};

const checkDuplicate = async (nama, id =null) => {
    const existingMethodPayment = await MethodPayment.findOne({
        where: { nama }
    });

    if (existingMethodPayment && existingMethodPayment.idmethodPayment != id) {
        throw new Error('Method Payment sudah ada!')
    }

    return true;
}

const fieldValidation = (nama, code) => {
    if (!nama || !code) {
        throw new Error('Semua field wajib diisi!')
    }

    return true;
};


const getAllMethodPayment = async () => {
    return await MethodPayment.findAll();
};

const getMethodPaymentById = async (id) => {
    return await findOrFail(id);
};

const createMethodPayment = async (nama, code) => {
    fieldValidation(nama, code);

    await checkDuplicate(nama);

    return await MethodPayment.create({
        nama,
        code
    });
};

const updateMethodPayment = async ({ id, nama, code }) => {
    fieldValidation(nama, code);

    await checkDuplicate(nama, id);

    const existingFMethodPayment = await findOrFail(id);

    return await existingFMethodPayment.update({
        nama,
        code
    });
};

const  destroyMethodPayment = async (id) => {
    const existingFMethodPayment = await findOrFail(id);

    return existingFMethodPayment.destroy();
};

module.exports = {
    getAllMethodPayment,
    getMethodPaymentById,
    createMethodPayment,
    updateMethodPayment,
    destroyMethodPayment
};
