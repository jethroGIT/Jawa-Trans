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

const checkDuplicateReservasi = async (idUser, idJadwal, id = null) => {
    const whereCondition = {
        idUser,
        idJadwal,
    };

    const existingReservasi = await Reservasi.findOne({
        where: whereCondition
    });

    if (existingReservasi && existingReservasi.idReservasi != id) {
        throw new Error('Reservasi dengan kursi tersebut sudah ada!');
    }

    return true;
};

const checkUserExist = async (idUser) => {
    const user = await User.findByPk(idUser);
    if (!user) {
        throw new Error('User tidak ditemukan!');
    }

    return true;
};

const checkJadwalExist = async (idJadwal) => {
    const jadwal =  await Jadwal.findByPk(idJadwal);
    if (!jadwal) {
        throw new Error('Jadwal tidak ditemukan!');
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

const createReservasi = async ({ idUser, idJadwal, penumpang, status = 'pending' }) => {
    if (!idUser || !idJadwal || !penumpang) {
        throw new Error('Field idUser, idJadwal, dan penumpang wajib diisi!');
    }
    
    await checkUserExist(idUser);

    await checkJadwalExist(idJadwal);
    
    // Cek duplikasi jika ada nomor kursi
    await checkDuplicateReservasi(idUser, idJadwal);

    return await Reservasi.create({
        idUser,
        idJadwal,
        penumpang,
        status
    });
};

const updateReservasi = async ({ id, idUser, idJadwal, penumpang, status }) => {
    const existingReservasi = await findReservasiOrFail(id);

    if (!idUser || !idJadwal || !penumpang) {
        throw new Error('Field idUser, idJadwal, dan penumpang wajib diisi!');
    }

    await checkUserExist(idUser);

    await checkJadwalExist(idJadwal);
    
    // Cek duplikasi jika ada nomor kursi
    await checkDuplicateReservasi(idUser, idJadwal, id);

    return await existingReservasi.update({
        idUser,
        idJadwal,
        penumpang,
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