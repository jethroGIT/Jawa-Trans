const db = require('../models');
const Mitra = db.Mitra;
const Tipe_Bus = db.Tipe_Bus;
const Foto_Bus = db.Foto_Bus;
const Fasilitas = db.Fasilitas;
const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

const findTipeOrFail = async (id) => {
    const existingTipe = await Tipe_Bus.findByPk(id, {
        include: [
            {
                model: Foto_Bus,
                as: 'foto_bus'
            },
            {
                model: Fasilitas,
                as: 'fasilitas',
                through: { attributes: [] }
            }
        ]
    });
    if (!existingTipe) {
        throw new Error('Tipe Bus tidak ditemukan!');
    }
    return existingTipe;
};

const fieldValidation = async ({ idMitra, tipe, kapasitas, fotos, isUpdate = false }) => {
    if (!idMitra || !tipe || !kapasitas) {
        throw new Error('Semua field harus diisi!');
    }

    const existingMitra = await Mitra.findByPk(idMitra);
    if (!existingMitra) {
        throw new Error('Mitra tidak ditemukan!');
    }

    if (kapasitas < 1 || kapasitas > 50) {
        throw new Error('Kapasitas harus antara 1 sampai 50!');
    }

    if (!isUpdate) {
        if (!Array.isArray(fotos) || fotos.length < 1 || fotos.length > 5) {
            throw new Error('Harap unggah minimal 1 foto dan maksimal 5 foto.');
        }
    } else {
        if (fotos && (fotos.length < 0 || fotos.length > 5)) {
            throw new Error('Maksimal 5 foto yang diperbolehkan saat update.');
        }
    }

    return true;
};

const checkDuplicateTipe = async (tipe, idMitra, id = null) => {
    const existingTipe = await Tipe_Bus.findOne({
        where: { tipe, idMitra }
    });
    if (existingTipe && existingTipe.idTipe != id) {
        throw new Error('Tipe bus sudah digunakan!');
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

const addUrlToFotoBus = (req, fotoBusArray) => {
    if (!fotoBusArray || !Array.isArray(fotoBusArray)) {
        return [];
    }

    return fotoBusArray.map(foto => ({
        ...foto,
        url: `${req.protocol}://${req.get('host')}/uploads/foto_bus/${foto.nama}`
    }));
};


const urlFotoBus = (req, data) => {
    if (Array.isArray(data)) {
        return data.map(item => ({
            ...item.toJSON(),
            foto_bus: item.foto_bus.map(foto => ({
                ...foto.toJSON(),
                url: `${req.protocol}://${req.get('host')}/uploads/foto_bus/${foto.nama}`
            }))
        }));
    } else {
        return {
            ...data.toJSON(),
            foto_bus: data.foto_bus.map(foto => ({
                ...foto.toJSON(),
                url: `${req.protocol}://${req.get('host')}/uploads/foto_bus/${foto.nama}`
            }))
        };
    }

};

const hapusFileStorage = (fotoFile) => {
    if (!fotoFile) return;
    const filePath = path.join(__dirname, '../uploads/foto_bus', fotoFile);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted foto: ${fotoFile}`);
    }
}

const getAllTipe = async (req) => {
    const data = await Tipe_Bus.findAll({
        include: [
            {
                model: Foto_Bus,
                as: 'foto_bus'
            },
            {
                model: Fasilitas,
                as: 'fasilitas',
                through: { attributes: [] }
            }
        ]
    });

    return data;
};

const getTipeBusByMitra = async (idMitra) => {
    const data = await Tipe_Bus.findAll({
        where: { idMitra },
    });

    return data;
};


const getTipeBusById = async (req, id) => {
    const data = await findTipeOrFail(id);

    return urlFotoBus(req, data);
};

const storeTipeBus = async ({ idMitra, tipe, kapasitas, fasilitas, fotos }) => {
    const transaction = await sequelize.transaction();
    try {
        await fieldValidation({ idMitra, tipe, kapasitas, fotos });

        await checkDuplicateTipe(tipe, idMitra);

        const fasilitasArray = konversiStringToIntArray(fasilitas);
        const validFasilitas = await validateFasilitas(fasilitasArray);

        const newTipe = await Tipe_Bus.create({ idMitra, tipe, kapasitas }, { transaction });

        await Promise.all(fotos.map(async (foto) => {
            await Foto_Bus.create({
                idTipe: newTipe.idTipe,
                nama: foto
            }, { transaction });
        }));

        await newTipe.setFasilitas(validFasilitas, { transaction });
        console.log(`Linked ${validFasilitas.length} fasilitas to tipe bus ${newTipe.idTipe}`);

        await transaction.commit();

        return newTipe;

    } catch (error) {
        await transaction.rollback();

        await Promise.all(
            fotos.map(foto => hapusFileStorage(foto))
        );

        throw error;
    }

    return data;
};

const updateTipeBus = async ({ id, idMitra, tipe, kapasitas, fasilitas, fotos, existingPhotos = [] }) => {
    const transaction = await sequelize.transaction();
    try {
        // Validasi field, note: kita perlu sesuaikan validasi foto karena sekarang kombinasi fotos (baru) + existingPhotos
        const totalPhotos = (fotos ? fotos.length : 0) + (existingPhotos ? existingPhotos.length : 0);

        await fieldValidation({ idMitra, tipe, kapasitas, fotos: [], isUpdate: true }); // Skip validasi array foto default dulu

        if (totalPhotos < 1 || totalPhotos > 5) {
            throw new Error('Total foto harus antara 1 sampai 5!');
        }

        const existingTipe = await findTipeOrFail(id);

        await checkDuplicateTipe(tipe, idMitra, id);

        const fasilitasArray = konversiStringToIntArray(fasilitas);
        const validFasilitas = await validateFasilitas(fasilitasArray);

        await existingTipe.update({ idMitra, tipe, kapasitas }, { transaction });

        await existingTipe.setFasilitas(validFasilitas, { transaction });
        console.log(`Linked ${validFasilitas.length} fasilitas to tipe bus ${existingTipe.idTipe}`);

        // MANAJEMEN FOTO
        const oldFotoRecords = await Foto_Bus.findAll({
            where: { idTipe: id },
            transaction
        });

        // 1. Identifikasi Foto yang harus DIHAPUS from DB
        // Foto di DB yang TIDAK ada di list 'existingPhotos' berarti user menghapusnya dari UI
        const existingPhotosSet = new Set(existingPhotos);
        const fotosToDelete = oldFotoRecords.filter(record => !existingPhotosSet.has(record.nama));

        // 2. Identifikasi Foto BARU yang harus DIINSERT (dari parameter fotos)
        // Parameter 'fotos' berisi array filename yang baru diupload -> insert semua
        const fotosToInsert = fotos || [];

        console.log('Existing Photos kept by user:', existingPhotos);
        console.log('Foto to DELETE from DB:', fotosToDelete.map(f => f.nama));
        console.log('Foto to INSERT to DB:', fotosToInsert);

        // EKSEKUSI DELETE
        if (fotosToDelete.length > 0) {
            await Foto_Bus.destroy({
                where: {
                    idTipe: id,
                    nama: fotosToDelete.map(f => f.nama)
                },
                transaction
            });

            // Hapus file fisik
            await Promise.all(
                fotosToDelete.map(async foto => {
                    hapusFileStorage(foto.nama);
                })
            );
        }

        // EKSEKUSI INSERT
        if (fotosToInsert.length > 0) {
            await Promise.all(
                fotosToInsert.map(foto =>
                    Foto_Bus.create({
                        idTipe: id,
                        nama: foto
                    }, { transaction })
                )
            );
        }

        await transaction.commit();

        // Return updated data with new photo URLs
        const updatedTipe = await findTipeOrFail(id);
        return updatedTipe;

    } catch (error) {
        await transaction.rollback();

        // Jika error, hapus foto baru yang terlanjur diupload
        if (fotos && fotos.length > 0) {
            await Promise.all(
                fotos.map(foto => hapusFileStorage(foto))
            );
        }

        throw error;
    }
};

const destroyTipeBus = async (id) => {
    const existingTipe = await findTipeOrFail(id);

    const oldFotoRecords = await Foto_Bus.findAll({
        where: { idTipe: id },
    });

    const oldFotoNames = oldFotoRecords.map(foto => foto.nama);

    await Promise.all(
        oldFotoNames.map(async foto => {
            hapusFileStorage(foto);
        })
    );

    return existingTipe.destroy();
};

module.exports = {
    getAllTipe,
    getTipeBusByMitra,
    getTipeBusById,
    storeTipeBus,
    updateTipeBus,
    destroyTipeBus
};