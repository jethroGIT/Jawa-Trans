const db = require('../models');
const Jadwal = db.Jadwal;
const Payment = db.Payment;
const reservasiService = require('../services/reservasi.service');
const midtransService = require('../services/midtrans.service');

const getAllReservasi = async (req, res) => {
    try {
        const reservasi = await reservasiService.getAllReservasi();
        return res.status(200).json({
            succes: true,
            data: reservasi
        });
    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: error.message
        })
    };
};

const getReservasiByMitra = async (req, res) => {
    try {
        const { idMitra } = req.params;
        const reservasi = await reservasiService.getReservasiByMitra(idMitra);
        return res.status(200).json({
            success: true,
            data: reservasi
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getJumlahReservasiPerStatus = async (req, res) => {
    try {
        const { idJadwal } = req.params;
        const reservasi = await reservasiService.getJumlahReservasiPerStatus(idJadwal);
        return res.status(200).json({
            success: true,
            data: reservasi
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const show = async (req, res) => {
    const { id } = req.params;
    try {
        const reservasi = await reservasiService.getReservasiById(id);
        return res.status(200).json({
            succes: true,
            data: reservasi
        });
    } catch (error) {
        return res.status(404).json({
            succes: false,
            message: error.message
        })
    };
};

const store = async (req, res) => {
    const { idUser, idJadwal, namaPenumpang, kursi, method, hargaSatuan } = req.body || {};
    try {
        // Validation handled in service
        const reservasi = await reservasiService.createReservasi({
            idUser,
            idJadwal,
            method: method || 'manual', // Fallback default
            hargaSatuan,
            namaPenumpang,
            kursi
        });

        return res.status(200).json({
            succes: true,
            data: 'Reservasi berhasil ditambahkan',
            reservasi
        });
    } catch (error) {
        return res.status(400).json({
            succes: false,
            message: error.message
        })
    };
};

const update = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};
    try {
        const reservasi = await reservasiService.updateReservasi({ id, status })
        return res.status(200).json({
            succes: true,
            message: 'Reservasi berhasil diperbaharui'
        });
    } catch (error) {
        return res.status(400).json({
            succes: false,
            message: error.message
        })
    };
};

const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const reservasi = await reservasiService.destroyReservasi(id);
        return res.status(200).json({
            succes: true,
            message: 'Reservasi berhasil dibatalkan'
        });
    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: error.message
        })
    };
};

// Controller tambahan untuk fitur khusus reservasi
const getReservasiByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const reservasi = await reservasiService.getReservasiByUser(id);
        return res.status(200).json({
            success: true,
            data: reservasi
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getJadwalByMitra = async (req, res) => {
    try {
        const { idMitra } = req.params;
        const reservasi = await reservasiService.getReservasiByMitra(idMitra);
        return res.status(200).json({
            success: true,
            data: reservasi
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getReservasiByJadwal = async (req, res) => {
    try {
        const { idJadwal } = req.params;
        const reservasi = await reservasiService.getReservasiByJadwal(idJadwal);
        return res.status(200).json({
            success: true,
            data: reservasi
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateStatusReservasi = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body || {};
        const reservasi = await reservasiService.updateStatusReservasi(id, status);
        return res.status(200).json({
            success: true,
            message: 'Status reservasi berhasil diupdate',
            data: reservasi
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const storeAndPay = async (req, res) => {
    const { idUser, idJadwal, namaPenumpang, kursi, method, customer, hargaSatuan } = req.body || {};

    // Hitung totalHarga berdasarkan jumlah kursi yang dipesan
    // Jumlah kursi = jumlah data reservasi_detail yang akan dibuat
    const totalHarga = (hargaSatuan * kursi.length);
    console.log("Received storeAndPay request:", totalHarga);

    try {
        // 1. Buat reservasi
        const reservasi = await reservasiService.createReservasi({
            idUser,
            idJadwal,
            method,
            hargaSatuan,
            namaPenumpang,
            kursi
        });
        const reservasiId = reservasi.idReservasi;

        // 2. Buat transaksi Midtrans
        const payment = await midtransService.createPayment(
            reservasiId.toString(),
            totalHarga,
            customer,
            method
        );

        return res.status(200).json({
            success: true,
            reservasiId,
            payment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getAllReservasi,
    getReservasiByMitra,
    getJadwalByMitra,
    getJumlahReservasiPerStatus,
    show,
    store,
    update,
    destroy,
    getReservasiByUser,
    getReservasiByJadwal,
    updateStatusReservasi,
    storeAndPay
};
