const db = require('../models');
const Mitra = db.Mitra;
const Bus = db.Bus;
const Fasilitas = db.Fasilitas;
const Bus_Fasilitas = db.Bus_Fasilitas;
const Foto_Bus = db.Foto_Bus;
const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

const findBusOrFail = async (id) => {
    const existingBus = await Bus.findByPk(id, {
        include: [
            {
                model: db.Foto_Bus,
                as: 'foto_bus'
            },
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

const fieldValidation = ({ idMitra, kode_bus, nama, type, kapasitas, status, fotos, isUpdate = false }) => {
    if (!idMitra || !kode_bus || !nama || !type || !kapasitas || !status) {
        throw new Error('Semua field wajib diisi');
    }

    // Saat create wajib upload foto, tapi saat update boleh kosong
    if (!isUpdate) {
        if ((!Array.isArray(fotos) || fotos.length < 1 || fotos.length > 5)) {
            throw new Error('Harap unggah minimal 1 foto dan maksimal 5 foto.');
        }
    } else {
        if (fotos && (fotos.length < 0 || fotos.length > 5)) {
            throw new Error('Maksimal 5 foto yang diperbolehkan saat update.');
        }
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

const konversiStringToIntArray = (fasilitas) => {
    let fasilitasArray = [];
    if (Array.isArray(fasilitas)) {
        fasilitasArray = fasilitas.map(f => parseInt(f, 10));
    } else {
        fasilitasArray = [parseInt(fasilitas, 10)];
    }

    return fasilitasArray;
};


const getAllBus = async () => {
    return await Bus.findAll({
        include: [
            {
                model: db.Foto_Bus,
                as: 'foto_bus'
            },
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
};

const getBusById = async (id) => {
    return await findBusOrFail(id);
};

const createBus = async ({ idMitra, kode_bus, nama, type, kapasitas, status, fasilitas, fotos }) => {
    const transaction = await sequelize.transaction();
    try {
        fieldValidation({ idMitra, kode_bus, nama, type, kapasitas, status, fotos });

        await checkDuplicateBus(kode_bus);

        const fasilitasArray = konversiStringToIntArray(fasilitas);
        const validFasilitas = await validateFasilitas(fasilitasArray);

        const newBus = await Bus.create({
            idMitra,
            kode_bus,
            nama,
            type,
            kapasitas,
            status
        }, { transaction });

        await Promise.all(fotos.map(async (foto) => {
            await Foto_Bus.create({
                idBus: newBus.idBus,
                nama: foto
            }, { transaction });
        }));

        await newBus.setFasilitas(validFasilitas, { transaction });
        console.log(`Linked ${validFasilitas.length} fasilitas to bus ${newBus.idBus}`);

        await transaction.commit();

        return newBus;
    } catch (error) {
        const busExist = await Bus.findOne({ where: { kode_bus } });
        if (!busExist && fotos && fotos.length > 0) {
            fotos.forEach(foto => {
                const filePath = path.join(__dirname, '../uploads/foto_bus', foto);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted foto: ${foto}`);
                }
            });
        }

        await transaction.rollback();

        throw error;
    };
};

const updatebus = async ({ id, idMitra, kode_bus, nama, type, kapasitas, status, fasilitas, fotos }) => {
    const transaction = await sequelize.transaction();
    let oldFotos = [];
    try {
        const existingBus = await findBusOrFail(id);

        fieldValidation({ idMitra, kode_bus, nama, type, kapasitas, status, fotos, isUpdate: true });

        await checkDuplicateBus(kode_bus, id);

        const fasilitasArray = konversiStringToIntArray(fasilitas);
        const validFasilitas = await validateFasilitas(fasilitasArray);

        await existingBus.update({
            idMitra,
            kode_bus,
            nama,
            type,
            kapasitas,
            status
        }, { transaction });

        // Jika ada foto baru
        if (fotos && fotos.length > 0) {
            const oldFotoRecords = await Foto_Bus.findAll({ where: { idBus: id }, transaction });
            const oldFotoNames = oldFotoRecords.map(fotoBus => fotoBus.nama);

            // cek apakah nama file sama persis (tidak ada perubahan)
            const isSame = fotos.every(fotoBus => oldFotoNames.includes(fotoBus));

            if (!isSame) {
                // simpan foto lama untuk dihapus nanti setelah commit
                oldFotos = oldFotoRecords;

                // hapus data lama di DB
                await Foto_Bus.destroy({ where: { idBus: id }, transaction });

                // insert data foto baru
                await Promise.all(fotos.map(async (foto) => {
                    await Foto_Bus.create({
                        idBus: existingBus.idBus,
                        nama: foto
                    }, { transaction });
                }));
            }
        }

        await existingBus.setFasilitas(validFasilitas, { transaction });

        await transaction.commit();

        if (oldFotos.length > 0 && fotos && fotos.length > 0) {
            oldFotos.forEach(foto => {
                const filePath = path.join(__dirname, '../uploads/foto_bus', foto.nama);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted old foto: ${foto.nama}`);
                }
            });
        }

        return existingBus;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        throw error;
    }
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