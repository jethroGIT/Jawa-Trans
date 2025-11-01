const { parse } = require('dotenv');
const db = require('../models');

const Jadwal = db.Jadwal;
const Bus = db.Bus;
const Fasilitas = db.Fasilitas;
const Terminal = db.Terminal;

// Reusable Helper
const findOrFail = async (id) => {
    const jadwal = await Jadwal.findByPk(id, {
        include: [
            {
                model: Bus,
                as: 'bus'
            },
            {
                model: Terminal,
                as: 'terminalNaik'
            },
            {
                model: Terminal,
                as: 'terminalTurun'
            }
        ]
    });

    if (!jadwal) {
        throw new Error('Jadwal tidak ditemukan.');
    }

    return jadwal;
};

const checkDuplicate = async ({ idBus, titik_naik, titik_turun, tanggal_keberangkatan, jam_keberangkatan, id = null }) => {
    const normalizedData = {
        idBus: parseInt(idBus),
        titik_naik: parseInt(titik_naik),
        titik_turun: parseInt(titik_turun),
        tanggal_keberangkatan: new Date(tanggal_keberangkatan),
        jam_keberangkatan: new Date(jam_keberangkatan)
    };

    const existingJadwal = await Jadwal.findOne({
        where: normalizedData
    });

    if (existingJadwal && existingJadwal.idJadwal != id) {
        throw new Error('Jadwal dengan bus, tanggal, rute dan jam yang sama sudah ada!');
    }

    return true;
};

const fieldValidation = ({ idBus, titik_naik, titik_turun, tanggal_keberangkatan, jam_keberangkatan, tanggal_kedatangan, jam_kedatangan, harga }) => {
    // Cek field wajib
    if (!idBus || !titik_naik || !titik_turun || !tanggal_keberangkatan || !jam_keberangkatan || !tanggal_kedatangan || !jam_kedatangan || !harga) {
        throw new Error('Semua field wajib diisi!');
    }

    // Validasi titik naik dan turun
    if (titik_naik === titik_turun) {
        throw new Error('Titik naik dan titik turun tidak boleh sama!');
    }

    // Validasi waktu keberangkatan dan kedatangan
    if (tanggal_keberangkatan >= tanggal_kedatangan) {
        throw new Error('Waktu kedatangan harus setelah waktu keberangkatan!');
    }

    if (jam_keberangkatan === jam_kedatangan) {
        throw new Error('Waktu kebarangkatan dan waktu kedatangan tidak boleh sama!');
    }

    if (parse(harga) <= 0) {
        throw new Error('Harga harus lebih besar dari 0 !');
    }

    return true;
};

const checkBusExists = async (idBus) => {
    const bus = await Bus.findByPk(idBus);
    if (!bus) {
        throw new Error('Bus tidak ditemukan!');
    }
    return true;
};

const checkTerminalExists = async (titik_naik, titik_turun) => {
    const terminalNaik = await Terminal.findByPk(titik_naik);
    const terminalTurun = await Terminal.findByPk(titik_turun);

    if (!terminalNaik) {
        throw new Error('Terminal keberangkatan tidak ditemukan!');
    }

    if (!terminalTurun) {
        throw new Error('Terminal kedatangan tidak ditemukan!');
    }

    return true;
};

const getAllJadwal = async () => {
    return await Jadwal.findAll({
        include: [
            {
                model: Bus,
                as: 'bus',
                include: [
                    {
                        model: Fasilitas,
                        as: 'fasilitas'
                    }
                ]
            },
            {
                model: Terminal,
                as: 'terminalNaik'
            },
            {
                model: Terminal,
                as: 'terminalTurun'
            }
        ],
        order: [['tanggal_keberangkatan', 'ASC'], ['jam_keberangkatan', 'ASC']]
    });
};

const getJadwalById = async (id) => {
    return await findOrFail(id);
};

const createJadwal = async (jadwalData) => {
    const {
        idBus,
        titik_naik,
        titik_turun,
        tanggal_keberangkatan,
        jam_keberangkatan,
        tanggal_kedatangan,
        jam_kedatangan,
        harga
    } = jadwalData;

    // Validasi field wajib
    fieldValidation({ 
        idBus, 
        titik_naik, 
        titik_turun, 
        tanggal_keberangkatan, 
        jam_keberangkatan, 
        tanggal_kedatangan, 
        jam_kedatangan, 
        harga 
    });

    // Cek apakah bus ada
    await checkBusExists(idBus);

    // Cek apakah terminal ada
    await checkTerminalExists(titik_naik, titik_turun);

    // Cek duplikasi
    await checkDuplicate({ 
        idBus, 
        titik_naik, 
        titik_turun, 
        tanggal_keberangkatan, 
        jam_keberangkatan
    });

    return await Jadwal.create({
        idBus: parseInt(idBus),
        titik_naik: parseInt(titik_naik),
        titik_turun: parseInt(titik_turun),
        tanggal_keberangkatan: new Date(tanggal_keberangkatan),
        jam_keberangkatan: new Date(jam_keberangkatan),
        tanggal_kedatangan: new Date(tanggal_kedatangan),
        jam_kedatangan: new Date(jam_kedatangan),
        harga: parseFloat(harga)
    });
};

const updateJadwal = async ({ id, idBus, tanggal, titik_naik, titik_turun, tanggal_keberangkatan, jam_keberangkatan, tanggal_kedatangan, jam_kedatangan, harga }) => {
    // Validasi field wajib
    fieldValidation({ idBus, titik_naik, titik_turun, tanggal_keberangkatan,jam_keberangkatan, tanggal_kedatangan, jam_kedatangan, harga });

    // Cek apakah bus ada
    await checkBusExists(idBus);

    // Cek apakah terminal ada
    await checkTerminalExists(titik_naik, titik_turun);

    // Cek duplikasi (exclude current record)
    await checkDuplicate({ idBus, titik_naik, titik_turun, tanggal_keberangkatan, jam_keberangkatan, id });

    // Cari jadwal yang akan diupdate
    const existingJadwal = await findOrFail(id);

    return await existingJadwal.update({
        idBus: parseInt(idBus),
        tanggal: new Date(tanggal),
        titik_naik: parseInt(titik_naik),
        titik_turun: parseInt(titik_turun),
        jam_keberangkatan: new Date(jam_keberangkatan),
        jam_kedatangan: new Date(jam_kedatangan),
        harga: harga.toString()
    });
};

const destroyJadwal = async (id) => {
    const existingJadwal = await findOrFail(id);
    return existingJadwal.destroy();
};

// Additional helper functions
const getJadwalByRute = async (titik_naik, titik_turun, tanggal = null) => {
    const whereClause = {
        titik_naik,
        titik_turun
    };

    if (tanggal) {
        whereClause.tanggal = tanggal;
    }

    return await Jadwal.findAll({
        where: whereClause,
        include: [
            {
                model: Bus,
                as: 'bus'
            },
            {
                model: Terminal,
                as: 'terminalNaik'
            },
            {
                model: Terminal,
                as: 'terminalTurun'
            }
        ],
        order: [['jam_keberangkatan', 'ASC']]
    });
};

const getJadwalByBus = async (idBus, tanggal = null) => {
    const whereClause = { idBus };

    if (tanggal) {
        whereClause.tanggal = tanggal;
    }

    return await Jadwal.findAll({
        where: whereClause,
        include: [
            {
                model: Bus,
                as: 'bus'
            },
            {
                model: Terminal,
                as: 'terminalNaik'
            },
            {
                model: Terminal,
                as: 'terminalTurun'
            }
        ],
        order: [['jam_keberangkatan', 'ASC']]
    });
};

module.exports = {
    getAllJadwal,
    getJadwalById,
    createJadwal,
    updateJadwal,
    destroyJadwal,
    getJadwalByRute,
    getJadwalByBus
};