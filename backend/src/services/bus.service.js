const db = require('../models');
const Mitra = db.Mitra;
const Bus = db.Bus;
const Fasilitas = db.Fasilitas;
const Bus_Fasilitas = db.Bus_Fasilitas;
const { sequelize } = require('../models');

const findBusOrFail = async (id) => {
    const existingBus = await Bus.findByPk(id, {
        include: [
            {
                model: Fasilitas,
                as: 'fasilitas',
                through: { attributes: [] }
            },
            {
                model: Mitra,
                as: 'mitra'
            }]
    });

    if (!existingBus) {
        throw new Error('Bus tidak ditemukan!')
    }

    return existingBus;
};

const fieldValidation = ({ idMitra, kode_bus, nama, type, kapasitas, status }) => {
    if (!idMitra || !kode_bus || !nama || !type || !kapasitas || !status) {
        throw new Error('Semua field wajib diisi')
    }

    return true;
};

const validateFasilitas = async (fasilitasId) => {
    if (!fasilitasId || !Array.isArray(fasilitasId)) {
        return [];
    }

    const existingFasilitas = await Fasilitas.findAll({
        where: { idFasilitas: fasilitasId }
    })

    // Validasi apakah semua fasilitas ID valid
    const validIds = existingFasilitas.map(f => f.idFasilitas);
    const invalidIds = fasilitasId.filter(id => !validIds.includes(id));

    if (invalidIds.length > 0) {
        throw new Error(`Fasilitas dengan ID ${invalidIds.join(', ')} tidak ditemukan`);
    }

    return existingFasilitas;
};

const checkDuplicateBus = async (kode_bus, id = null) => {
    const existingBus = await Bus.findOne({
        where: { kode_bus }
    });

    if (existingBus && existingBus.idBus != id) {
        throw new Error('Bus sudah ada!')
    }
    
    return true;
};


const getAllBus = async () => {
    return await Bus.findAll({
        include: [
            {
                model: db.Fasilitas,
                as: 'fasilitas',
                through: { attributes: [] }
            },
            {
                model: Mitra,
                as: 'mitra'
            }]
    });
};

const getBusById = async (id) => {
    return await findBusOrFail(id);
};

const createBus = async ({ idMitra, kode_bus, nama, type, kapasitas, status, fasilitas }) => {
    const transaction = await sequelize.transaction();
    try {
        fieldValidation({ idMitra, kode_bus, nama, type, kapasitas, status });

        const validFasilitas = await validateFasilitas(fasilitas);

        await checkDuplicateBus(kode_bus);

        const newBus = await Bus.create({
            idMitra,
            kode_bus,
            nama,
            type,
            kapasitas,
            status
        }, { transaction });

        await newBus.setFasilitas(validFasilitas, { transaction });
        console.log(`Linked ${validFasilitas.length} fasilitas to bus ${newBus.idBus}`);

        await transaction.commit();

        return newBus;
    } catch (error) {
        await transaction.rollback();
        throw error;
    };
};

const updatebus = async ({ id, idMitra, kode_bus, nama, type, kapasitas, status, fasilitas }) => {
    const transaction = await sequelize.transaction();
    try {
        fieldValidation({ idMitra, kode_bus, nama, type, kapasitas, status });

        const validFasilitas = await validateFasilitas(fasilitas);

        const existingBus = await findBusOrFail(id);

        await checkDuplicateBus(kode_bus, id);

        const updateBus = await existingBus.update({
            idMitra,
            kode_bus,
            nama,
            type,
            kapasitas,
            status
        }, { transaction });

        await updateBus.setFasilitas(validFasilitas, { transaction });
        console.log(`Linked ${validFasilitas.length} fasilitas to bus ${updateBus.idBus}`);

        await transaction.commit();

        return updateBus;
    } catch (error) {
        await transaction.rollback();
        throw error;
    };
};

const destroyBus = async (id) => {
    const existingBus = await findBusOrFail(id);

    return existingBus.destroy();
};

module.exports = {
    getAllBus,
    getBusById,
    createBus,
    updatebus,
    destroyBus
};