const db = require('../models');
const Jadwal = db.Jadwal;
const Reservasi = db.Reservasi;
const Penumpang = db.Reservasi_Detail;
const jadwalService = require('./jadwal.service');
const reservasiService = require('./reservasi.service');

const getDaftarPenumpangById = async (req, id) => {
    console.log('ID Jadwal:', id);
    const jadwal = await jadwalService.getJadwalById(req, id);
    const reservasi = await reservasiService.getReservasiByJadwal(id);

    return {
        jadwal,
        reservasi
    }
};

module.exports = {
    getDaftarPenumpangById
};
