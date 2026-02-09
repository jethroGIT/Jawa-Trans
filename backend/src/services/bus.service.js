const db = require('../models');
const Bus = db.Bus;
const Jenis_Kendaraan = db.Jenis_Kendaraan; // Changed from Tipe_Bus
const Fasilitas = db.Fasilitas;
const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

const findBusOrFail = async (id) => {
    const existingBus = await Bus.findByPk(id, {
        include: [
            {
                model: Jenis_Kendaraan,
                as: 'jenis_kendaraan',
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

const fieldValidation = async ({ idTipe, plat_nomor, kode_bus, kapasitas }) => {
    if (!idTipe || !plat_nomor || !kode_bus || !kapasitas) {
        throw new Error('Semua field wajib diisi (termasuk kapasitas)');
    }

    const existingTipe = await Jenis_Kendaraan.findByPk(idTipe);
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

    // Validate kapasitas
    const kapasitasNum = parseInt(kapasitas);
    if (isNaN(kapasitasNum) || kapasitasNum < 1 || kapasitasNum > 100) {
        throw new Error('Kapasitas harus antara 1-100 penumpang');
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
                model: Jenis_Kendaraan,
                as: 'jenis_kendaraan',
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
                model: Jenis_Kendaraan,
                as: 'jenis_kendaraan',
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

const createBus = async ({ idTipe, plat_nomor, kode_bus, kapasitas }) => {
    const transaction = await sequelize.transaction();
    try {
        await fieldValidation({ idTipe, plat_nomor, kode_bus, kapasitas });

        await checkDuplicateBus(plat_nomor, kode_bus);

        const newBus = await Bus.create({
            idTipe,
            plat_nomor,
            kode_bus,
            kapasitas: parseInt(kapasitas),
            status: 1 // Default status: 1 = aktif
        }, { transaction });

        await transaction.commit();

        return newBus;
    } catch (error) {
        await transaction.rollback();
        throw error;
    };
};

const updatebus = async ({ id, idTipe, plat_nomor, kode_bus, kapasitas, status }) => {
    const transaction = await sequelize.transaction();

    try {
        const existingBus = await findBusOrFail(id);

        await fieldValidation({ idTipe, plat_nomor, kode_bus, kapasitas });
        await checkDuplicateBus(plat_nomor, kode_bus, id);

        // Ensure status is a tinyint (0, 1, or 2)
        let statusValue = parseInt(status);
        if (isNaN(statusValue) || ![0, 1, 2].includes(statusValue)) {
            statusValue = 1; // Default to aktif if invalid
        }

        // Parse kapasitas, default to existing value if not provided
        const kapasitasValue = kapasitas ? parseInt(kapasitas) : existingBus.kapasitas;

        await existingBus.update({
            idTipe,
            plat_nomor,
            kode_bus,
            kapasitas: kapasitasValue,
            status: statusValue
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
    // Removed Foto_Bus deletion logic because photos now belong to Jenis_Kendaraan, not Bus directly.
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