const db = require('../models');
const Mitra = db.Mitra;
const Bus = db.Bus;
const Tipe_Bus = db.Tipe_Bus;
const Fasilitas = db.Fasilitas;
const Foto_Bus = db.Foto_Bus;
const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

const findBusOrFail = async (id) => {
    const existingBus = await Bus.findByPk(id, {
        include: [
            {
                model: Mitra,
                as: 'mitra'
            },
            {
                model: Tipe_Bus,
                as: 'tipe_bus',
                include: [
                    {
                        model: Fasilitas,
                        as: 'fasilitas',
                        through: { attributes: [] }
                    }
                ]
            }
        ]
    });

    if (!existingBus) {
        throw new Error('Bus tidak ditemukan!')
    }

    return existingBus;
};

const fieldValidation = async ({ idMitra, idTipe, plat_nomor, kode_bus }) => {
    if (!idMitra || !idTipe || !plat_nomor || !kode_bus) {
        throw new Error('Semua field wajib diisi');
    }

    const existingMitra = await Mitra.findByPk(idMitra);
    if (!existingMitra) {
        console.log(existingMitra);
        throw new Error('Mitra tidak ditemukan');
    }

    const existingTipe = await Tipe_Bus.findByPk(idTipe);
    if (!existingTipe) {
        console.log(existingTipe);
        throw new Error('Tipe kendaraan tidak ditemukan');
    }

    if (plat_nomor.length > 10) {
        throw new Error('Plat nomor maksimal 10 karakter');
    }

    if (kode_bus.length > 10) {
        throw new Error('Kode bus maksimal 10 karakter');
    }

    return true;
};

const checkDuplicateBus = async (plat_nomor, kode_bus, idMitra, id = null) => {
    const existingPlatNomor = await Bus.findOne({
        where: { plat_nomor, idMitra }
    });
    if (existingPlatNomor && existingPlatNomor.idBus != id) {
        throw new Error('Plat nomor sudah digunakan!');
    }

    const existingKodeBus = await Bus.findOne({
        where: { kode_bus, idMitra }
    });
    if (existingKodeBus && existingKodeBus.idBus != id) {
        throw new Error('Kode bus sudah digunakan!');
    }

    return true;
};

const getAllBus = async (req) => {
    const data = await Bus.findAll({
        include: [
            {
                model: Mitra,
                as: 'mitra'
            },
            {
                model: Tipe_Bus,
                as: 'tipe_bus',
                include: [
                    {
                        model: Fasilitas,
                        as: 'fasilitas',
                        through: { attributes: [] }
                    }
                ]
            }
        ]
    });

    return data;
};

const getBusByMitra = async (idMitra) => {
    const data = await Bus.findAll({
        where: { idMitra },
        include: [
            {
                model: Mitra,
                as: 'mitra'
            },
            {
                model: Tipe_Bus,
                as: 'tipe_bus',
                include: [
                    {
                        model: Fasilitas,
                        as: 'fasilitas',
                        through: { attributes: [] }
                    }
                ]
            }
        ]
    });

    return data;
};

const getBusById = async (req, id) => {
    const bus = await findBusOrFail(id);
    return bus;
};

const createBus = async ({ idMitra, idTipe, plat_nomor, kode_bus }) => {
    const transaction = await sequelize.transaction();
    try {
        await fieldValidation({ idMitra, idTipe, plat_nomor, kode_bus });

        await checkDuplicateBus(plat_nomor, kode_bus, idMitra);

        const newBus = await Bus.create({
            idMitra,
            idTipe,
            plat_nomor,
            kode_bus,
        }, { transaction });

        await transaction.commit();

        return newBus;
    } catch (error) {
        await transaction.rollback();
        throw error;
    };
};

const updatebus = async ({ id, idMitra, idTipe, plat_nomor, kode_bus }) => {
    const transaction = await sequelize.transaction();

    try {
        const existingBus = await findBusOrFail(id);

        await fieldValidation({ idMitra, idTipe, plat_nomor, kode_bus });
        await checkDuplicateBus(plat_nomor, kode_bus, idMitra, id);

        await existingBus.update({
            idMitra, idTipe, plat_nomor, kode_bus
        }, { transaction });

        await transaction.commit();

        return existingBus;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};



const destroyBus = async (id) => {
    const existingBus = await findBusOrFail(id);

    const oldFotoRecords = await Foto_Bus.findAll({
        where: { idBus: id },
    });

    const oldFotoNames = oldFotoRecords.map(foto => foto.nama);

    await Promise.all(
        oldFotoNames.map(async foto => {
            hapusFileStorage(foto);
        })
    );

    return existingBus.destroy();
};

module.exports = {
    getAllBus,
    getBusByMitra,
    getBusById,
    createBus,
    updatebus,
    destroyBus
};