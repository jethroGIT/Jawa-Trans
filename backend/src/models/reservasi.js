const { DataTypes } = require('sequelize');

let Reservasi; // Inisialisasi variabel model

const defineReservasiModel = (sequelize) => {
    Reservasi = sequelize.define('Reservasi', {
        idReservasi: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        method: {
            type: DataTypes.STRING(45),
            allowNull: false,
            comment: 'Metode pembayaran: gopay, bca, bni, mandiri, qris'
        },
        hargaSatuan: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Harga per tiket/kursi'
        },
        waktuBayar: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp pembayaran berhasil (NULL jika belum dibayar)'
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
            comment: '0 = pending, 1 = paid, 2 = expire'
        }
    }, {
        tableName: 'reservasi',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        comment: 'Tabel header reservasi. Catatan: Tabel ini tidak memiliki kolom jumlah kursi. Jumlah kursi dihitung dari COUNT(reservasidetail). Total harga = hargaSatuan * COUNT(reservasidetail).'
    });

    return Reservasi;
};

module.exports = defineReservasiModel;