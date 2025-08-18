const db = require('../models');
const Reservasi = db.Reservasi;
const User = db.User;
const Jadwal = db.Jadwal;

const findReservasiOrFail = async (id) => {
    const reservasi = await Reservasi.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: Jadwal,
                as: 'jadwal'
            }
        ]
    });
    if (!reservasi) {
        throw new Error('Reservasi tidak ditemukan.');
    };
    return reservasi;
};

const checkDuplicateReservasi = async (idUser, idJadwal, noKursi, id = null) => {
    const whereCondition = {
        idUser,
        idJadwal,
        noKursi
    };

    const existingReservasi = await Reservasi.findOne({
        where: whereCondition
    });

    if (existingReservasi && existingReservasi.idReservasi != id) {
        throw new Error('Reservasi dengan kursi tersebut sudah ada!');
    }

    return true;
};

const getAllReservasi = async () => {
    return await Reservasi.findAll({
        include: [
            {
                model: db.User,
                as: 'user'
            },
            {
                model: db.Jadwal,
                as: 'jadwal'
            }
        ]
    });
};

const getReservasiById = async (id) => {
    return await findReservasiOrFail(id);
};

const createReservasi = async ({ idUser, idJadwal, penumpang, noKursi, status = 'pending' }) => {
    if (!idUser || !idJadwal || !penumpang) {
        throw new Error('Field idUser, idJadwal, dan penumpang wajib diisi!');
    }

    // Cek duplikasi jika ada nomor kursi
    if (noKursi) {
        await checkDuplicateReservasi(idUser, idJadwal, noKursi);
    }

    return await Reservasi.create({
        idUser,
        idJadwal,
        penumpang,
        noKursi,
        status
    });
};

const updateReservasi = async ({ id, idUser, idJadwal, penumpang, noKursi, status }) => {
    if (!idUser || !idJadwal || !penumpang) {
        throw new Error('Field idUser, idJadwal, dan penumpang wajib diisi!');
    }
    
    const existingReservasi = await findReservasiOrFail(id);

    // Cek duplikasi jika ada nomor kursi
    if (noKursi) {
        await checkDuplicateReservasi(idUser, idJadwal, noKursi, id);
    }


    return await existingReservasi.update({
        idUser,
        idJadwal,
        penumpang,
        noKursi,
        status
    });
};

const destroyReservasi = async (id) => {
    const existingReservasi = await findReservasiOrFail(id);
    return await existingReservasi.destroy();
};

const getReservasiByUser = async (idUser) => {
    return await Reservasi.findAll({
        where: { idUser },
        include: [
            {
                model: db.User,
                as: 'user'
            },
            {
                model: db.Jadwal,
                as: 'jadwal'
            }
        ]
    });
};

const getReservasiByJadwal = async (idJadwal) => {
    return await Reservasi.findAll({
        where: { idJadwal },
        include: [
            {
                model: db.User,
                as: 'user'
            },
            {
                model: db.Jadwal,
                as: 'jadwal'
            }
        ]
    });
};

const updateStatusReservasi = async (id, status) => {
    if (!status) {
        throw new Error('Status wajib diisi!');
    }

    const existingReservasi = await findReservasiOrFail(id);

    return await existingReservasi.update({ status });
};

module.exports = {
    getAllReservasi,
    getReservasiById,
    createReservasi,
    updateReservasi,
    destroyReservasi,
    getReservasiByUser,
    getReservasiByJadwal,
    updateStatusReservasi
};