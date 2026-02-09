# Perubahan Struktur Database Reservasi (31 Jan 2026)

## Ringkasan Perubahan

Pada tanggal 31 Januari 2026, dilakukan pembaruan struktur database untuk tabel reservasi yang mencakup:

### 1. **Tabel Reservasi**
- ❌ **Kolom `kursi` DIHAPUS** - Tidak lagi menyimpan jumlah kursi yang dipesan
- ✅ Kolom yang tersisa:
  - `idReservasi` (PK)
  - `idUser` (FK ke customer)
  - `method` (metode pembayaran)
  - `hargaSatuan` (harga per tiket/kursi)
  - `waktuBayar` (timestamp pembayaran)
  - `status` (0=pending, 1=paid, 2=expire)
  - `created_at`, `updated_at`

### 2. **Tabel Reservasi_Detail**
- ✅ **Kolom `idJadwal` DITAMBAH** - Sekarang menyimpan referensi ke jadwal
- ✅ Kolom yang ada:
  - `idJadwal` (PK) - **BARU**
  - `idReservasi` (PK, FK ke reservasi)
  - `noKursi` (PK) - nomor kursi
  - `namaPenumpang` - nama penumpang
  - `created_at`, `updated_at`

### 3. **Tabel Kursi**
- ❌ **DIHAPUS SEPENUHNYA** - Tidak lagi diperlukan

---

## Implikasi Pada Logika Bisnis

### Menghitung Jumlah Kursi yang Dipesan

**Sebelumnya:**
```sql
-- Mengambil dari kolom 'kursi' di tabel reservasi
SELECT kursi FROM reservasi WHERE idReservasi = 1;
-- Result: 3 (jumlah kursi)
```

**Sekarang:**
```sql
-- Menghitung jumlah baris di reservasi_detail
SELECT COUNT(*) as jumlahKursi 
FROM reservasidetail 
WHERE idReservasi = 1;
-- Result: 3 (jumlah penumpang/kursi)
```

**Dalam Code JavaScript:**
```javascript
const jumlahKursi = await Reservasi_Detail.count({
    where: { idReservasi: 1 }
});
// Result: 3
```

---

### Menghitung Total Harga

**Sebelumnya:**
```javascript
// Total harga: hargaSatuan * kursi (langsung dari kolom)
const totalHarga = reservasi.hargaSatuan * reservasi.kursi;
```

**Sekarang:**
```javascript
// Total harga: hargaSatuan * COUNT(reservasi_detail)
const jumlahKursi = await Reservasi_Detail.count({
    where: { idReservasi: reservasi.idReservasi }
});
const totalHarga = reservasi.hargaSatuan * jumlahKursi;
```

**Helper Function:**
```javascript
// Menggunakan helper function yang telah disediakan
const totalHarga = await reservasiService.getTotalHargaReservasi(reservasi);
```

---

## Update di Backend

### File yang Diubah

#### 1. **backend/src/services/reservasi.service.js**
- ✅ Tambah helper functions:
  - `getJumlahKursiReservasi(idReservasi)` - Menghitung jumlah kursi
  - `getTotalHargaReservasi(reservasi)` - Menghitung total harga

#### 2. **backend/src/controllers/reservasi.controller.js**
- ✅ Update comment di `storeAndPay()` function
- ✅ Perhitungan `totalHarga = hargaSatuan * kursi.length` tetap benar karena `kursi` adalah array dari frontend

#### 3. **backend/src/models/reservasi.js**
- ✅ Tambah comment tentang perubahan struktur
- ✅ Tambah comment di field `method`, `hargaSatuan`, `waktuBayar`, `status`

#### 4. **backend/src/models/reservasi_detail.js**
- ✅ Tambah comment di setiap field
- ✅ Tambah comment table level menjelaskan struktur composite key

---

## Contoh Query Keseluruhannya

### Get Reservasi dengan Detail dan Hitung Total Harga

```javascript
// 1. Ambil reservasi dengan detail
const reservasi = await Reservasi.findByPk(1, {
    include: [{
        model: Reservasi_Detail,
        as: 'reservasi_detail',
        include: [{
            model: Jadwal,
            as: 'jadwal'
        }]
    }]
});

// 2. Hitung jumlah kursi (= jumlah baris reservasi_detail)
const jumlahKursi = reservasi.reservasi_detail.length;

// 3. Hitung total harga
const totalHarga = reservasi.hargaSatuan * jumlahKursi;

// Result:
// {
//   idReservasi: 1,
//   idUser: 5,
//   method: 'gopay',
//   hargaSatuan: 150000,
//   status: 1,
//   reservasi_detail: [
//     { idReservasi: 1, idJadwal: 3, noKursi: 1, namaPenumpang: 'Budi' },
//     { idReservasi: 1, idJadwal: 3, noKursi: 2, namaPenumpang: 'Ani' },
//     { idReservasi: 1, idJadwal: 3, noKursi: 5, namaPenumpang: 'Citra' }
//   ],
//   jumlahKursi: 3,
//   totalHarga: 450000
// }
```

---

## Validasi yang Masih Berlaku

✅ **Masih melakukan:**
- Validasi nama penumpang = jumlah kursi
- Validasi kursi tidak boleh kosong
- Cek kursi sudah dipesan (status pending/paid)
- Validasi nomor kursi dalam range kapasitas bus
- Database transaction untuk konsistensi

---

## Keuntungan Perubahan Ini

1. **Fleksibilitas**: Tidak perlu pre-allocate kolom kursi di header reservasi
2. **Konsistensi**: Jumlah kursi selalu sesuai dengan jumlah baris detail yang ada
3. **Simplifikasi**: Tidak perlu tabel terpisah untuk manajemen kursi
4. **Normalisasi DB**: Struktur lebih normal (one-to-many relationship yang jelas)
5. **Audit Trail**: Setiap detail kursi memiliki timestamp sendiri

---

## Migration Script (Jika Diperlukan)

Jika Anda menggunakan database lama dan ingin migrate ke struktur baru:

```sql
-- 1. Backup tabel lama
CREATE TABLE reservasi_backup AS SELECT * FROM reservasi;
CREATE TABLE reservasidetail_backup AS SELECT * FROM reservasidetail;

-- 2. Drop kolom 'kursi' dari reservasi
ALTER TABLE reservasi DROP COLUMN kursi;

-- 3. Tambah kolom 'idJadwal' ke reservasidetail
ALTER TABLE reservasidetail ADD COLUMN idJadwal INT NOT NULL BEFORE idReservasi;

-- 4. Update primary key (jika perlu restructure)
ALTER TABLE reservasidetail DROP PRIMARY KEY;
ALTER TABLE reservasidetail ADD PRIMARY KEY (idJadwal, idReservasi, noKursi);

-- 5. Tambah foreign key constraint untuk idJadwal
ALTER TABLE reservasidetail 
ADD CONSTRAINT fk_ReservasiDetail_Jadwal
FOREIGN KEY (idJadwal) REFERENCES jadwal(idJadwal)
ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

## Testing

Untuk memverifikasi perubahan bekerja dengan benar:

```bash
# 1. Test membuat reservasi
POST /api/reservasi/pay
{
  "idUser": 1,
  "idJadwal": 1,
  "namaPenumpang": ["Budi", "Ani", "Citra"],
  "kursi": [1, 2, 5],
  "method": "gopay",
  "customer": { "name": "Budi", "email": "budi@mail.com", "phone": "08123456789" },
  "hargaSatuan": 150000
}

# 2. Verifikasi di database
SELECT COUNT(*) as jumlahKursi FROM reservasidetail WHERE idReservasi = 1;
-- Result: 3

# 3. Hitung total harga
SELECT hargaSatuan * (SELECT COUNT(*) FROM reservasidetail WHERE idReservasi = 1) as totalHarga 
FROM reservasi WHERE idReservasi = 1;
-- Result: 450000
```

---

## Next Steps

- ✅ Update backend models dan services
- ⏳ Test API endpoints
- ⏳ Update frontend jika ada yang reference jumlah kursi secara langsung
- ⏳ Update dokumentasi API
- ⏳ Update tests/unit tests
