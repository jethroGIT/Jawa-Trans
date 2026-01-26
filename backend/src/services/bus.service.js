const db = require('../models');
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

const fieldValidation = async ({ idTipe, plat_nomor, kode_bus }) => {
    if (!idTipe || !plat_nomor || !kode_bus) {
        throw new Error('Semua field wajib diisi');
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

const checkDuplicateBus = async (plat_nomor, kode_bus, id = null) => {
    const existingPlatNomor = await Bus.findOne({
        where: { plat_nomor }
    });
    if (existingPlatNomor && existingPlatNomor.idBus != id) {
        throw new Error('Plat nomor sudah digunakan!');
    }

    const existingKodeBus = await Bus.findOne({
        where: { kode_bus }
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

const getBusByTipe = async (idTipe) => {
    const data = await Bus.findAll({
        where: { idTipe },
        include: [
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

const createBus = async ({ idTipe, plat_nomor, kode_bus }) => {
    const transaction = await sequelize.transaction();
    try {
        await fieldValidation({ idTipe, plat_nomor, kode_bus });

        await checkDuplicateBus(plat_nomor, kode_bus);

        const newBus = await Bus.create({
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

const updatebus = async ({ id, idTipe, plat_nomor, kode_bus, status }) => {
    const transaction = await sequelize.transaction();

    try {
        const existingBus = await findBusOrFail(id);

        await fieldValidation({ idTipe, plat_nomor, kode_bus });
        await checkDuplicateBus(plat_nomor, kode_bus, id);

        await existingBus.update({
            idTipe,
            plat_nomor,
            kode_bus,
            status: status
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
    getBusByTipe,
    getBusById,
    createBus,
    updatebus,
    destroyBus
};