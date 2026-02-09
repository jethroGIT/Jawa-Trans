const db = require('../models');
const Jadwal = db.Jadwal;
const Reservasi = db.Reservasi;
const Reservasi_Detail = db.Reservasi_Detail;
const jadwalService = require('./jadwal.service');
const reservasiService = require('./reservasi.service');

const getDaftarPenumpangById = async (req, id) => {
    console.log('ID Jadwal:', id);
    const jadwal = await jadwalService.getJadwalById(req, id);
    
    // Get reservasi_detail langsung dengan relasi ke reservasi dan customer
    const reservasi_detail = await Reservasi_Detail.findAll({
        where: { idJadwal: id },
        include: [
            {
                model: Reservasi,
                as: 'reservasi',
                include: [
                    {
                        model: db.Customer,
                        as: 'customer',
                        attributes: ['idUser', 'nama', 'email', 'telephone', 'alamat']
                    }
                ]
            }
        ],
        order: [['idReservasi', 'ASC'], ['noKursi', 'ASC']]
    });

    return {
        jadwal,
        reservasi_detail
    }
};

module.exports = {
    getDaftarPenumpangById
};
