const db = require('../models');
const Bus = db.Bus;
const Kursi = db.Kursi;

const findKursiOrFail = async (idKursi) => {
    const kursi = await Kursi.findOne({
        where: {idKursi}
    });
    if (!kursi) {
        throw new Error('Kursi tidak ditemukan!');
    }
    return kursi;
};

const validateBus = async (idBus) => {
    const bus = await Bus.findByPk(idBus);
    if (!bus) {
        throw new Error('Bus tidak ditemukan!');
    }
    return true;
};

const checkKursiDuplicate = async (noKursi, idKursi = null) => {
    const kursi = await Kursi.findOne({
        where: {noKursi}
    });

    if (kursi && kursi.idKursi != idKursi) {
        throw new Error('Kursi sudah ada!');
    }

    return true;
};


const getAllKursi = async () => {
    return await Kursi.findAll();
};

const getKursiByIdBus = async (idBus) => {
    await validateBus(idBus);

    const kursi =  await Kursi.findAll({
        where: {idBus}
    });

    if (!kursi) {
        throw new Error('Belum ada data kursi yang tersedia!');
    }

    return kursi;
};

const getKursiById = async (idBus, idKursi) => {
    await validateBus(idBus);
    return await findKursiOrFail(idKursi);
};

const createKursi = async({ idBus, noKursi, tipe }) => {
    if (!idBus || !noKursi || !tipe) {
        throw new Error('Semua field wajib diisi!');
    }

    await validateBus(idBus);

    await checkKursiDuplicate(noKursi);

    return await Kursi.create({
        idBus,
        noKursi,
        tipe
    });
}

const updateKursi = async ({ idBus, idKursi, noKursi, tipe }) => {
    const kursi = await findKursiOrFail(idKursi);

    if (!idBus || !noKursi || !tipe) {
        throw new Error('Semua field wajib diisi!');
    }

    await validateBus(idBus);

    await checkKursiDuplicate(noKursi, idKursi);

    return await kursi.update({
        idBus,
        noKursi,
        tipe
    });
};

const destroyKursi = async(idKursi) => {
    const kursi = await findKursiOrFail(idKursi);
    return kursi.destroy();
};

module.exports = {
    getAllKursi,
    getKursiByIdBus,
    getKursiById,
    createKursi,
    updateKursi,
    destroyKursi
};

