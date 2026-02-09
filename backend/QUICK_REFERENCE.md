# 🎯 QUICK REFERENCE - Perubahan Database Reservasi

## 📊 Struktur Database Terbaru

### Tabel RESERVASI (Header)
```sql
idReservasi (PK)
├─ idUser (FK)
├─ method (VARCHAR) - gopay|bca|bni|mandiri|qris
├─ hargaSatuan (INT) - Harga PER TIKET
├─ waktuBayar (DATETIME, nullable)
├─ status (TINYINT) - 0=pending, 1=paid, 2=expire
└─ timestamps (created_at, updated_at)

💡 PENTING: Tidak ada kolom 'kursi' lagi!
```

### Tabel RESERVASI_DETAIL (Detail Per Penumpang)
```sql
idJadwal (PK)
├─ Referensi ke jadwal perjalanan
├─ idReservasi (PK) - Referensi ke reservasi header
├─ noKursi (PK) - Nomor kursi (1 s/d kapasitas bus)
├─ namaPenumpang (VARCHAR) - Nama penumpang untuk kursi ini
└─ timestamps (created_at, updated_at)

💡 Composite Key: (idJadwal, idReservasi, noKursi)
```

---

## 🔢 Perhitungan Baru

### Jumlah Kursi yang Dipesan
```javascript
// ❌ LAMA - Tidak bisa lagi!
const jumlah = reservasi.kursi; // kolom sudah dihapus

// ✅ BARU
const jumlah = await reservasiService.getJumlahKursiReservasi(idReservasi);
// atau
const jumlah = await Reservasi_Detail.count({ 
    where: { idReservasi } 
});
```

### Total Harga
```javascript
// ❌ LAMA - Tidak bisa lagi!
const total = reservasi.hargaSatuan * reservasi.kursi;

// ✅ BARU
const total = await reservasiService.getTotalHargaReservasi(reservasi);
// atau manual
const jumlah = await Reservasi_Detail.count({ where: { idReservasi } });
const total = reservasi.hargaSatuan * jumlah;
```

---

## 🛠 Helper Functions (Baru)

### Function 1: getJumlahKursiReservasi()
```javascript
/**
 * Hitung jumlah kursi dari count reservasi_detail
 * @param {number} idReservasi - ID reservasi
 * @returns {Promise<number>} Jumlah kursi
 */
const jumlah = await reservasiService.getJumlahKursiReservasi(idReservasi);
// Result: 3
```

### Function 2: getTotalHargaReservasi()
```javascript
/**
 * Hitung total harga: hargaSatuan * count(reservasi_detail)
 * @param {object} reservasi - Object dengan field hargaSatuan
 * @returns {Promise<number>} Total harga
 */
const total = await reservasiService.getTotalHargaReservasi(reservasi);
// Result: 450000 (jika hargaSatuan=150000, jumlahKursi=3)
```

---

## 📝 Contoh Usage

### 1. Create Reservasi (Dari Frontend)
```javascript
// POST /api/reservasi/pay
{
  "idUser": 1,
  "idJadwal": 5,
  "namaPenumpang": ["Budi", "Ani", "Citra"],
  "kursi": [1, 2, 5],
  "method": "gopay",
  "hargaSatuan": 150000,
  "customer": { 
    "name": "Budi", 
    "email": "budi@mail.com", 
    "phone": "08123456789" 
  }
}

// Controller hitung totalHarga
const totalHarga = 150000 * 3; // = 450000 ✅
```

### 2. Get Reservasi dengan Detail
```javascript
const reservasi = await Reservasi.findByPk(1, {
    include: [{
        model: Reservasi_Detail,
        as: 'reservasi_detail'
    }]
});

// Hitung jumlah kursi
const jumlahKursi = reservasi.reservasi_detail.length; // 3

// Hitung total harga
const totalHarga = reservasi.hargaSatuan * jumlahKursi; // 450000
```

### 3. Using Helper Functions
```javascript
// Hitung jumlah kursi
const jumlah = await reservasiService.getJumlahKursiReservasi(1);
console.log(jumlah); // 3

// Hitung total harga
const total = await reservasiService.getTotalHargaReservasi(reservasi);
console.log(total); // 450000
```

---

## ⚙️ Query SQL References

### Count Kursi Untuk Reservasi Tertentu
```sql
SELECT COUNT(*) as jumlahKursi 
FROM reservasidetail 
WHERE idReservasi = 1;
-- Result: 3
```

### Get Total Harga
```sql
SELECT 
  r.hargaSatuan * COUNT(rd.idReservasi) as totalHarga
FROM reservasi r
LEFT JOIN reservasidetail rd ON r.idReservasi = rd.idReservasi
WHERE r.idReservasi = 1
GROUP BY r.idReservasi;
-- Result: 450000
```

### Get All Details Untuk Reservasi
```sql
SELECT 
  rd.idJadwal, 
  rd.idReservasi, 
  rd.noKursi, 
  rd.namaPenumpang,
  r.hargaSatuan,
  COUNT(*) OVER (PARTITION BY rd.idReservasi) as jumlahKursi
FROM reservasidetail rd
JOIN reservasi r ON rd.idReservasi = r.idReservasi
WHERE rd.idReservasi = 1
ORDER BY rd.noKursi;
```

---

## ✅ Perubahan Per File

| File | Perubahan | Status |
|------|-----------|--------|
| reservasi.controller.js | Comment diperbaharui | ✅ |
| reservasi.service.js | Helper functions ditambah | ✅ |
| reservasi.js (model) | Comment ditambah | ✅ |
| reservasi_detail.js (model) | Comment ditambah | ✅ |
| PERUBAHAN_DATABASE.md | Documentation | ✅ |

---

## 🚫 DEPRECATED - Jangan Gunakan Lagi

```javascript
// ❌ LAMA - TIDAK BERLAKU LAGI!
reservasi.kursi                  // Kolom sudah dihapus
const total = harga * res.kursi;  // Gunakan helper function
Kursi.findAll()                  // Tabel sudah dihapus
```

---

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lebih detail, lihat:
- 📖 `backend/PERUBAHAN_DATABASE.md` - Dokumentasi teknis lengkap
- 📋 `backend/CHECKLIST_PERUBAHAN.md` - Checklist testing & implementasi

---

## 🎓 Tips Development

1. **Selalu gunakan helper functions** untuk consistency
2. **Include detail saat fetch** agar bisa langsung count
3. **Test dengan berbagai jumlah penumpang** (1, 3, 5)
4. **Verifikasi di database** bahwa idJadwal tersimpan dengan benar
5. **Gunakan transaction** agar semua detail sukses atau semua gagal

---

**Last Updated:** 31 Jan 2026  
**Version:** 1.0
