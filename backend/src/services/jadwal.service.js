const db = require('../models');

const Jadwal = db.Jadwal;
const Bus = db.Bus;
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

const checkDuplicate = async (idBus, tanggal, titik_naik, titik_turun, jam_keberangkatan, id = null) => {
    const existingJadwal = await Jadwal.findOne({
        where: { 
            idBus,
            tanggal,
            titik_naik,
            titik_turun,
            jam_keberangkatan
        }
    });

    if (existingJadwal && existingJadwal.idJadwal != id) {
        throw new Error('Jadwal dengan bus, tanggal, rute dan jam yang sama sudah ada!');
    }

    return true;
};

const fieldValidation = (idBus, titik_naik, titik_turun, jam_keberangkatan, jam_kedatangan, harga) => {
    if (!idBus || !titik_naik || !titik_turun || !jam_keberangkatan || !jam_kedatangan || !harga) {
        throw new Error('Semua field wajib diisi!');
    }

    if (titik_naik === titik_turun) {
        throw new Error('Titik naik dan titik turun tidak boleh sama!');
    }

    if (jam_keberangkatan === jam_kedatangan) {
        throw new Error('Jam kebarangkatan dan kedatangan tidak boleh sama!');
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
        order: [['tanggal', 'ASC'], ['jam_keberangkatan', 'ASC']]
    });
};

const getJadwalById = async (id) => {
    return await findOrFail(id);
};

const createJadwal = async (jadwalData) => {
    const {
        idBus,
        tanggal,
        titik_naik,
        titik_turun,
        jam_keberangkatan,
        jam_kedatangan,
        harga
    } = jadwalData;

    // Validasi field wajib
    fieldValidation(idBus, titik_naik, titik_turun, jam_keberangkatan, jam_kedatangan, harga);

    // Cek apakah bus ada
    await checkBusExists(idBus);

    // Cek apakah terminal ada
    await checkTerminalExists(titik_naik, titik_turun);

    // Cek duplikasi
    await checkDuplicate(idBus, tanggal, titik_naik, titik_turun, jam_keberangkatan);

    return await Jadwal.create({
        idBus,
        tanggal,
        titik_naik,
        titik_turun,
        jam_keberangkatan,
        jam_kedatangan,
        harga
    });
};

const updateJadwal = async ({ id, idBus, tanggal, titik_naik, titik_turun, jam_keberangkatan, jam_kedatangan, harga }) => {
    // Validasi field wajib
    fieldValidation(idBus, titik_naik, titik_turun, jam_keberangkatan, jam_kedatangan, harga);

    // Cek apakah bus ada
    await checkBusExists(idBus);

    // Cek apakah terminal ada
    await checkTerminalExists(titik_naik, titik_turun);

    // Cek duplikasi (exclude current record)
    await checkDuplicate(idBus, tanggal, titik_naik, titik_turun, jam_keberangkatan, id);

    // Cari jadwal yang akan diupdate
    const existingJadwal = await findOrFail(id);

    return await existingJadwal.update({
        idBus,
        tanggal,
        titik_naik,
        titik_turun,
        jam_keberangkatan,
        jam_kedatangan,
        harga
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