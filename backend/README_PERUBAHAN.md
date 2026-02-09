# 📖 Panduan Perubahan Database Struktur Reservasi

**Tanggal Implementasi:** 31 Januari 2026  
**Status:** ✅ Siap untuk Testing & Deployment

---

## 🎯 Tujuan Cepat

Struktur database telah diubah:
- ❌ Tabel `reservasi` tidak punya kolom `kursi` lagi
- ✅ Tabel `reservasi_detail` punya kolom `idJadwal` (baru)
- ❌ Tabel `kursi` telah dihapus

**Konsekuensi:**
- Jumlah kursi = `COUNT(reservasi_detail WHERE idReservasi = ?)`
- Total harga = `hargaSatuan * COUNT(reservasi_detail)`

---

## 📚 Dokumentasi (Pilih Sesuai Kebutuhan)

### 🔰 Pemula? Mulai dari sini!
**File:** [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md)
- ⏱️ Waktu baca: **5 menit**
- 📋 Isi: Quick lookup reference
- 👥 Untuk: Semua developer
- 🎯 Tujuan: Memahami perubahan dengan cepat

### 🛠️ Backend Developer
**Files (dalam urutan):**
1. [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) - 5 min
2. [`TEST_HELPER_FUNCTIONS.js`](./TEST_HELPER_FUNCTIONS.js) - 10 min (lihat contoh)
3. [`PERUBAHAN_DATABASE.md`](./PERUBAHAN_DATABASE.md) - 15 min (detail)
4. [`FINAL_SUMMARY.md`](./FINAL_SUMMARY.md) - 10 min (comprehensive)

**Action Items:**
- Gunakan helper functions: `getJumlahKursiReservasi()` & `getTotalHargaReservasi()`
- Update custom queries yang reference kolom `kursi`
- Test dengan berbagai jumlah penumpang

### 🔧 DevOps / Database Admin
**Files:**
1. [`PERUBAHAN_DATABASE.md`](./PERUBAHAN_DATABASE.md) - Lihat "Migration Script"
2. [`FINAL_SUMMARY.md`](./FINAL_SUMMARY.md) - Lihat "Migration Path"

**Action Items:**
- Backup database sebelum perubahan
- Test migration script di staging
- Prepare rollback plan
- Setup monitoring

### 🧪 QA / Tester
**Files:**
1. [`CHECKLIST_PERUBAHAN.md`](./CHECKLIST_PERUBAHAN.md) - Testing checklist
2. [`TEST_HELPER_FUNCTIONS.js`](./TEST_HELPER_FUNCTIONS.js) - Test scenarios

**Action Items:**
- Run 16 test scenarios
- Test berbagai jumlah penumpang (1, 3, 5, 10)
- Verify payment gateway integration
- Check database transaction rollback

### 📊 Project Manager
**Files:**
1. [`FINAL_SUMMARY.md`](./FINAL_SUMMARY.md) - Comprehensive overview
2. [`CHECKLIST_PERUBAHAN.md`](./CHECKLIST_PERUBAHAN.md) - Implementation status

**Action Items:**
- Monitor team progress
- Ensure QA completion
- Approve deployment
- Plan rollback strategy

---

## 🗂️ File Index & Deskripsi

| File | Ukuran | Durasi | Tujuan |
|------|--------|--------|--------|
| **QUICK_REFERENCE.md** | 5.5 KB | 5 min | Quick lookup untuk semua dev |
| **PERUBAHAN_DATABASE.md** | 6.6 KB | 15 min | Technical documentation lengkap |
| **CHECKLIST_PERUBAHAN.md** | 6.0 KB | 10 min | Implementation & testing checklist |
| **FINAL_SUMMARY.md** | 13 KB | 20 min | Comprehensive guide & reference |
| **TEST_HELPER_FUNCTIONS.js** | - | 20 min | Test scenarios & examples |
| **IMPLEMENTATION_STATUS.txt** | - | 5 min | Visual summary & status |

---

## 🔄 Alur Cepat untuk Menggunakan Helper Functions

### Cara Lama (Tidak Berlaku Lagi ❌)
```javascript
const jumlahKursi = reservasi.kursi;              // Kolom sudah dihapus!
const totalHarga = hargaSatuan * reservasi.kursi;  // Error!
```

### Cara Baru (✅ BENAR)
```javascript
// Method 1: Manual
const jumlahKursi = await Reservasi_Detail.count({
    where: { idReservasi: 1 }
});
const totalHarga = hargaSatuan * jumlahKursi;

// Method 2: Gunakan Helper (RECOMMENDED)
const jumlahKursi = await reservasiService.getJumlahKursiReservasi(1);
const totalHarga = await reservasiService.getTotalHargaReservasi(reservasi);
```

---

## 📝 Contoh Penggunaan Helper Functions

### Example 1: Get Reservasi & Hitung Total
```javascript
// Get reservasi dengan detail
const reservasi = await Reservasi.findByPk(1, {
    include: [{ model: Reservasi_Detail }]
});

// Hitung jumlah kursi
const jumlah = await reservasiService.getJumlahKursiReservasi(reservasi.idReservasi);
console.log(`Penumpang: ${jumlah} orang`);

// Hitung total harga
const total = await reservasiService.getTotalHargaReservasi(reservasi);
console.log(`Total bayar: Rp ${total.toLocaleString('id-ID')}`);
```

### Example 2: Create Reservasi
```javascript
const input = {
    idUser: 5,
    idJadwal: 5,
    method: 'gopay',
    hargaSatuan: 150000,
    namaPenumpang: ['Budi', 'Ani', 'Citra'],
    kursi: [1, 2, 5]
};

// Create
const reservasi = await reservasiService.createReservasi(input);

// Verify
const jumlah = await reservasiService.getJumlahKursiReservasi(reservasi.idReservasi);
const total = await reservasiService.getTotalHargaReservasi(reservasi);

console.log(`Created: ${jumlah} kursi, Total: Rp ${total}`);
```

---

## ✅ Checklist Implementasi

### Development
- [ ] Baca QUICK_REFERENCE.md
- [ ] Pahami helper functions
- [ ] Update code yang using `reservasi.kursi`
- [ ] Gunakan helper functions di code baru
- [ ] Test di local/development

### Testing
- [ ] Run unit tests (helper functions)
- [ ] Test berbagai jumlah penumpang
- [ ] Test error cases
- [ ] Test payment gateway integration
- [ ] Verify database struktur

### Deployment
- [ ] Backup database
- [ ] Test migration di staging
- [ ] Prepare rollback plan
- [ ] Deploy ke production
- [ ] Monitor error logs

---

## 🆘 Troubleshooting

### Error: "Cannot find property 'kursi'"
**Penyebab:** Code masih trying to access kolom `kursi` yang sudah dihapus  
**Solusi:** Gunakan helper function `getJumlahKursiReservasi()` atau COUNT query

### Error: "TotalHarga tidak sesuai"
**Penyebab:** Perhitungan totalHarga salah  
**Solusi:** Gunakan helper function `getTotalHargaReservasi()`

### Database Error Saat Migration
**Penyebab:** Struktur database tidak sesuai  
**Solusi:** Lihat migration script di PERUBAHAN_DATABASE.md

### Payment Gateway Mismatch
**Penyebab:** totalHarga yang dikirim ke payment gateway salah  
**Solusi:** Verify calculation menggunakan helper function sebelum kirim ke payment gateway

---

## 📞 Kontak & Support

Jika ada pertanyaan atau issue:
1. Cek QUICK_REFERENCE.md dulu (5 min)
2. Cek TEST_HELPER_FUNCTIONS.js untuk contoh
3. Refer ke PERUBAHAN_DATABASE.md untuk detail teknis
4. Contact backend team jika masih ada issue

---

## 🎓 Learning Path

### Untuk Pemula
1. QUICK_REFERENCE.md (5 min)
2. TEST_HELPER_FUNCTIONS.js (10 min)
3. Coba contoh code di section "Contoh Penggunaan"
4. Lihat FINAL_SUMMARY.md kalau perlu detail

### Untuk Advanced
1. FINAL_SUMMARY.md (comprehensive)
2. PERUBAHAN_DATABASE.md (technical deep dive)
3. Review code changes di setiap file
4. Understand relational model & foreign keys

---

## 🔗 Quick Links

- [📋 Checklist Perubahan](./CHECKLIST_PERUBAHAN.md)
- [📖 Database Technical Doc](./PERUBAHAN_DATABASE.md)
- [⚡ Quick Reference](./QUICK_REFERENCE.md)
- [📚 Final Summary](./FINAL_SUMMARY.md)
- [🧪 Test Scenarios](./TEST_HELPER_FUNCTIONS.js)
- [📊 Status Visual](./IMPLEMENTATION_STATUS.txt)

---

## 📅 Changelog

### v1.0 (31 Jan 2026)
- ✅ Database structure updated
- ✅ Helper functions added
- ✅ Documentation created
- ✅ Test scenarios prepared
- ✅ Ready for testing & deployment

---

**Version:** 1.0  
**Last Updated:** 31 Januari 2026  
**Status:** ✅ READY

---

*Terima kasih telah membaca dokumentasi ini!*  
*Semoga implementasi perubahan database berjalan lancar.* 🚀
