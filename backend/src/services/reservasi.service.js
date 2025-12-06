const db = require('../models');
const Reservasi = db.Reservasi;
const Reservasi_Detail = db.Reservasi_Detail;
const Kursi = db.Kursi;
const User = db.User;
const Jadwal = db.Jadwal;
const Terminal = db.Terminal;
const { sequelize } = require('../models');
const { Op } = require('sequelize');


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
            },
            {
                model: Reservasi_Detail,
                as: 'reservasi_detail'
            }
        ]
    });
    if (!reservasi) {
        throw new Error('Reservasi tidak ditemukan.');
    };
    return reservasi;
};

const checkDuplicateReservasi = async (idUser, idJadwal, kursi = [], id = null) => {
    // Jika diberikan array kursi, cek apakah ada kursi yang sudah dipesan (status pending)
    if (Array.isArray(kursi) && kursi.length > 0) {
        const kursiBooking = await Reservasi_Detail.findAll({
            include: [
                {
                    model: Reservasi,
                    as: 'reservasi',
                    where: {
                        idJadwal,
                        status: {
                            [Op.in]: ['pending', 'paid']
                        }
                    }
                }
            ],
            where: { noKursi: kursi }
        });

        // Jika sedang melakukan update, abaikan detail reservasi milik reservasi yang sama
        const filtered = id ? kursiBooking.filter(d => d.idReservasi != id) : kursiBooking;

        if (filtered.length > 0) {
            const kursiSudahDipesan = filtered.map(item => item.noKursi);
            throw new Error(`Kursi ${kursiSudahDipesan.join(', ')} sudah dipesan`);
        }

        return true;
    }

    // Jika tidak ada kursi yang dikirim, fallback ke cek berdasarkan user + jadwal
    const whereCondition = {
        idUser,
        idJadwal
    };

    const existingReservasi = await Reservasi.findOne({
        where: whereCondition
    });

    if (existingReservasi && existingReservasi.idReservasi != id) {
        throw new Error('Reservasi dengan jadwal tersebut sudah ada!');
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
    const jadwal = await Jadwal.findByPk(idJadwal);
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

const createReservasi = async ({ idUser, idJadwal, penumpang, namaPenumpang, kursi }) => {
    if (!idUser || !idJadwal || !penumpang) {
        throw new Error('Field idUser, idJadwal, dan penumpang wajib diisi!');
    }

    if (!Array.isArray(namaPenumpang) || namaPenumpang.length === 0) {
        throw new Error('Mohon masukan nama penumpang');
    }

    if (!Array.isArray(kursi) || kursi.length === 0) {
        throw new Error('Mohon masukan nomor kursi');
    }

    if (namaPenumpang.length !== penumpang) {
        throw new Error(`Jumlah nama penumpang (${namaPenumpang.length}) harus sama dengan jumlah penumpang (${penumpang})!`);
    }

    if (kursi.length !== penumpang) {
        throw new Error(`Jumlah kursi (${kursi.length}) harus sama dengan jumlah penumpang (${penumpang})!`);
    }

    await checkUserExist(idUser);

    await checkJadwalExist(idJadwal);

    await checkDuplicateReservasi(idUser, idJadwal, kursi);

    const jadwal = await Jadwal.findByPk(idJadwal);
    if (!jadwal) {
        throw new Error('Jadwal tidak ditemukan!');
    }

    const kursiValid = await Kursi.findAll({
        where: {
            idBus: jadwal.idBus,
            noKursi: kursi
        }
    });
    if (kursiValid.length !== kursi.length) {
        throw new Error('Ada kursi yang tidak valid untuk bus ini!');
    }

    const kursiBooking = await Reservasi_Detail.findAll({
        include: [
            {
                model: Reservasi,
                as: 'reservasi',
                where: {
                    idJadwal,
                    status: 'pending'
                }
            }
        ],
        where: { noKursi: kursi }
    });

    if (kursiBooking.length > 0) {
        // Ambil nomor kursi yang sudah dipesan
        const kursiSudahDipesan = kursiBooking.map(item => item.noKursi);
        let errorMessage = `Kursi ${kursiSudahDipesan.join(', ')} sudah dipesan`;
        throw new Error(errorMessage);
    }

    const transaction = await sequelize.transaction();
    try {
        // Buat data reservasi
        const reservasi = await Reservasi.create({
            idUser,
            idJadwal,
            penumpang,
            status: "pending"
        }, { transaction });

        // Buat data reservasi detail untuk setiap kursi
        const reservasiDetails = [];
        for (let i = 0; i < kursi.length; i++) {
            const detail = await Reservasi_Detail.create({
                idReservasi: reservasi.idReservasi,
                namaPenumpang: namaPenumpang[i],
                noKursi: kursi[i],
                status: "pending"
            }, { transaction });

            reservasiDetails.push(detail);
        }

        // Commit transaksi
        await transaction.commit();

        return reservasi;

    } catch (error) {
        // Rollback transaksi jika ada error
        await transaction.rollback();
        throw error;
    }

};

const updateReservasi = async ({ id, idUser, idJadwal, penumpang, status }) => {
    const existingReservasi = await findReservasiOrFail(id);

    if (!idUser || !idJadwal || !penumpang) {
        throw new Error('Field idUser, idJadwal, dan penumpang wajib diisi!');
    }

    await checkUserExist(idUser);

    await checkJadwalExist(idJadwal);

    await checkDuplicateReservasi(idUser, idJadwal, [], id);

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
        order: [['idReservasi', 'DESC']],
        include: [
            {
                model: Jadwal,
                as: 'jadwal',
                include: [
                    {
                        model: Terminal,
                        as: 'terminalNaik'
                    },
                    {
                        model: Terminal,
                        as: 'terminalTurun'
                    }
                ]
            },
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