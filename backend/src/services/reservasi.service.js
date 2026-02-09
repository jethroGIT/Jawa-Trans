const db = require('../models');
const Reservasi = db.Reservasi;
const Reservasi_Detail = db.Reservasi_Detail;
const Customer = db.Customer;
const Jadwal = db.Jadwal;
const Terminal = db.Terminal;
const Bus = db.Bus;
const Jenis_Kendaraan = db.Jenis_Kendaraan;
const Mitra = db.Mitra;
const jadwalService = require('./jadwal.service');
const { sequelize } = require('../models');
const { Op } = require('sequelize');
const { get } = require('../routes/api');

const fieldValidation = ({ idUser, idJadwal, method, hargaSatuan, namaPenumpang, kursi }) => {
    // idUser, method, hargaSatuan are for Reservasi
    // idJadwal, namaPenumpang, kursi are for Reservasi_Detail logic

    if (!idUser || !idJadwal || !method || !hargaSatuan) {
        throw new Error('Field idUser, idJadwal, method, dan hargaSatuan wajib diisi!');
    }

    if (!Array.isArray(namaPenumpang) || namaPenumpang.length === 0) {
        throw new Error('Mohon masukan nama penumpang');
    }

    if (!Array.isArray(kursi) || kursi.length === 0) {
        throw new Error('Mohon masukan nomor kursi');
    }

    if (namaPenumpang.length !== kursi.length) {
        throw new Error(`Jumlah nama penumpang (${namaPenumpang.length}) harus sama dengan jumlah kursi (${kursi.length})!`);
    }

    return true;
}

const findReservasiOrFail = async (id) => {
    const reservasi = await Reservasi.findByPk(id, {
        include: [
            {
                model: Customer,
                as: 'customer'
            },
            {
                model: Reservasi_Detail,
                as: 'reservasi_detail',
                include: [
                    {
                        model: Jadwal,
                        as: 'jadwal',
                        include: [
                            { model: Terminal, as: 'terminalNaik' },
                            { model: Terminal, as: 'terminalTurun' },
                            {
                                model: Bus,
                                as: 'bus',
                                include: [{
                                    model: Jenis_Kendaraan,
                                    as: 'jenis_kendaraan',
                                    include: [{ model: Mitra, as: 'mitra' }]
                                }]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    if (!reservasi) {
        throw new Error('Reservasi tidak ditemukan.');
    };
    return reservasi;
};

// Check if seats are already booked for a specific schedule
const checkDuplicateReservasi = async (idJadwal, kursi = []) => {
    if (Array.isArray(kursi) && kursi.length > 0) {
        const kursiBooking = await Reservasi_Detail.findAll({
            where: {
                idJadwal: idJadwal,
                noKursi: { [Op.in]: kursi }
            },
            include: [
                {
                    model: Reservasi,
                    as: 'reservasi',
                    where: {
                        status: {
                            [Op.in]: [0, 1] // 0: Pending, 1: Paid
                        }
                    }
                }
            ]
        });

        if (kursiBooking.length > 0) {
            const kursiSudahDipesan = kursiBooking.map(item => item.noKursi);
            throw new Error(`Kursi nomor ${kursiSudahDipesan.join(', ')} sudah dipesan`);
        }
        return true;
    }
    return true;
};

const checkCustomerExist = async (idUser) => {
    const customer = await Customer.findByPk(idUser);
    if (!customer) {
        throw new Error('Customer tidak ditemukan!');
    }
    return true;
};

const checkJadwalExist = async (idJadwal) => {
    const jadwal = await Jadwal.findByPk(idJadwal, {
        include: [{
            model: Bus,
            as: 'bus',
            include: [{ model: Jenis_Kendaraan, as: 'jenis_kendaraan' }]
        }]
    });

    if (!jadwal) {
        throw new Error('Jadwal tidak ditemukan!');
    }
    return jadwal;
};


const getAllReservasi = async () => {
    return await Reservasi.findAll({
        include: [
            {
                model: Customer,
                as: 'customer'
            },
            {
                model: Reservasi_Detail,
                as: 'reservasi_detail',
                include: [{
                    model: Jadwal,
                    as: 'jadwal'
                }]
            }
        ]
    });
};

const getJumlahKursiTerjual = async (idJadwal) => {
    const count = await Reservasi_Detail.count({
        where: { idJadwal: idJadwal },
        include: [
            {
                model: Reservasi,
                as: 'reservasi',
                where: { status: 1 } // Hanya yang sudah dibayar
            }
        ]
    });
    return count;
};

const getTotalHargaJadwal = async (jadwal) => {
    const jumlahKursi = await getJumlahKursiTerjual(jadwal.idJadwal);
    return jadwal.harga * jumlahKursi;
};

const getJumlahReservasiPerStatus = async (idJadwal) => {
    const jadwal = await Jadwal.findByPk(idJadwal, {
        include: [
            {
                model: Bus,
                as: 'bus',
                include: [
                    {
                        model: Jenis_Kendaraan,
                        as: 'jenis_kendaraan',
                    }
                ]
            },
            { model: Terminal, as: 'terminalNaik' },
            { model: Terminal, as: 'terminalTurun' }
        ]
    });

    if (!jadwal) {
        throw new Error('Jadwal tidak ditemukan!');
    }

    const pending = await Reservasi.count({
        where: { status: 0 },
        include: [
            {
                model: Reservasi_Detail,
                as: 'reservasi_detail',
                where: { idJadwal: idJadwal }
            }
        ]
    });
    const totalPending = jadwal.harga * pending;

    const paid = await Reservasi.count({
        where: { status: 1 },
        include: [
            {
                model: Reservasi_Detail,
                as: 'reservasi_detail',
                where: { idJadwal: idJadwal }
            }
        ]
    });
    const totalPaid = jadwal.harga * paid;

    const expire = await Reservasi.count({
        where: { status: 2 },
        include: [
            {
                model: Reservasi_Detail,
                as: 'reservasi_detail',
                where: { idJadwal: idJadwal }
            }
        ]
    });
    const totalExpire = jadwal.harga * expire;

    const reservasiJadwal = await Reservasi.findAll({
        include: [
            {
                model: Reservasi_Detail,
                as: 'reservasi_detail',
                where: { idJadwal: idJadwal }
            },
            {
                model: Customer,
                as: 'customer'
            }
        ]
    })

    const count = {
        jadwal,
        pending,
        paid,
        expire,
        totalPending,
        totalPaid,
        totalExpire,
        reservasiJadwal
    };

    return count;
}

const getDetailKeuanganJadwal = async (idJadwal) => {
    const jadwal = await Jadwal.findByPk(idJadwal);
    const count = await getJumlahReservasiPerStatus(idJadwal);
    return {
        ...jadwal.toJSON(),
        ...count
    };
}

const getReservasiByMitra = async (idMitra) => {
    // Dapatkan semua jadwal yang terkait dengan mitra
    const jadwalList = await Jadwal.findAll({
        include: [
            {
                model: Bus,
                as: 'bus',
                include: [
                    {
                        model: Jenis_Kendaraan,
                        as: 'jenis_kendaraan',
                        where: { idMitra: idMitra },
                        include: [{ model: Mitra, as: 'mitra' }]
                    }
                ]
            },
            { model: Terminal, as: 'terminalNaik' },
            { model: Terminal, as: 'terminalTurun' }
        ]
    });

    // Tambahkan informasi total pendapatan untuk setiap jadwal
    const jadwalWithPendapatan = await Promise.all(
        jadwalList.map(async (jadwal) => {
            // Hitung jumlah reservasi detail yang sudah dibayar (status = 1)
            const jumlahTerjual = await getJumlahKursiTerjual(jadwal.idJadwal);

            const totalPendapatan = await getTotalHargaJadwal(jadwal);

            return {
                ...jadwal.toJSON(),
                jumlahTerjual,
                totalPendapatan
            };
        })
    );

    return jadwalWithPendapatan;
};

const getReservasiById = async (id) => {
    return await findReservasiOrFail(id);
};

const createReservasi = async ({ idUser, idJadwal, method, hargaSatuan, namaPenumpang, kursi }) => {
    await checkCustomerExist(idUser);
    const jadwal = await checkJadwalExist(idJadwal);

    const capacity = jadwal.bus.kapasitas;
    for (const seatNo of kursi) {
        if (seatNo < 1 || seatNo > capacity) {
            throw new Error(`Kursi nomor ${seatNo} tidak valid for bus ini (Kapasitas: ${capacity})`);
        }
    }

    await checkDuplicateReservasi(idJadwal, kursi);

    const transaction = await sequelize.transaction();
    try {
        const reservasi = await Reservasi.create({
            idUser,
            method,
            hargaSatuan,
            waktuBayar: null,
        }, { transaction });

        const reservasiDetails = [];
        for (let i = 0; i < kursi.length; i++) {
            const detail = await Reservasi_Detail.create({
                idJadwal: idJadwal,
                idReservasi: reservasi.idReservasi,
                noKursi: kursi[i],
                namaPenumpang: namaPenumpang[i]
            }, { transaction });

            reservasiDetails.push(detail);
        }

        await transaction.commit();

        return await findReservasiOrFail(reservasi.idReservasi);

    } catch (error) {
        await transaction.rollback();
        throw error;
    }

};

const updateReservasi = async ({ id, status }) => {
    const existingReservasi = await findReservasiOrFail(id);

    if (status === undefined) {
        throw new Error('Status wajib diisi!');
    }

    return await existingReservasi.update({
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
                model: Reservasi_Detail,
                as: 'reservasi_detail',
                include: [
                    {
                        model: Jadwal,
                        as: 'jadwal',
                        include: [
                            { model: Terminal, as: 'terminalNaik' },
                            { model: Terminal, as: 'terminalTurun' },
                            { model: Bus, as: 'bus' } // Simple bus info
                        ]
                    }
                ]
            }
        ]
    });
};

const getReservasiByJadwal = async (idJadwal) => {
    return await Reservasi_Detail.findAll({
        where: { idJadwal },
        include: [
            {
                model: Reservasi,
                as: 'reservasi',
                include: [{ model: Customer, as: 'customer' }]
            }
        ]
    });
};

const updateStatusReservasi = async (id, status) => {
    if (status === undefined) {
        throw new Error('Status wajib diisi!');
    }

    const existingReservasi = await findReservasiOrFail(id);
    return await existingReservasi.update({ status });
};

const updateStatusByOrderId = async (orderId, status) => {
    return await updateStatusReservasi(orderId, status);
}


module.exports = {
    getAllReservasi,
    getReservasiByMitra,
    getReservasiById,
    createReservasi,
    updateReservasi,
    destroyReservasi,
    getReservasiByUser,
    getReservasiByJadwal,
    updateStatusReservasi,
    updateStatusByOrderId,
    getJumlahKursiTerjual,
    getTotalHargaJadwal,
    getJumlahReservasiPerStatus,
};