
// components/payment/MetodePembayaranCard.jsx
import { useState } from "react";
import bca from "../../assets/Pembayaran/bca.png";
import bri from "../../assets/Pembayaran/bri.png";
import bni from "../../assets/Pembayaran/bni.png";
import mandiri from "../../assets/Pembayaran/mandiri.png";
import gopay from "../../assets/Pembayaran/gopay.png";
import qris from "../../assets/Pembayaran/oripay.png";

export default function MetodePembayaranCard({
    metodePembayaran,
    onMetodeChange,
    setujuSyarat,
    onSetujuChange,
    onKonfirmasi,
    onBatal,
    totalHarga
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Data metode pembayaran dengan logo
    const metodeVA = [
        { id: "bca", nama: "Bank BCA VA", kode: "bca", logo: bca },
        { id: "bni", nama: "Bank BNI VA", kode: "bni", logo: bni },
        { id: "bri", nama: "Bank BRI VA", kode: "bri", logo: bri },
        { id: "mandiri", nama: "Bank Mandiri VA", kode: "mandiri", logo: mandiri }
    ];

    const metodeInstan = [
        { id: "gopay", nama: "GOPAY", kode: "gopay", logo: gopay },
        { id: "qris", nama: "QRIS", kode: "qris", logo: qris }
    ];

    const handlePilihVA = (bankId) => {
        onMetodeChange({
            virtualAccount: bankId,
            pembayaranInstan: ""
        });
    };

    const handlePilihInstan = (methodId) => {
        onMetodeChange({
            virtualAccount: "",
            pembayaranInstan: methodId
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                    Pilih Metode Pembayaran
                </h2>
            </div>

            {/* Virtual Account */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                    Virtual Account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {metodeVA.map((bank) => (
                        <div
                            key={bank.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${metodePembayaran.virtualAccount === bank.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            onClick={() => handlePilihVA(bank.id)}
                        >
                            <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${metodePembayaran.virtualAccount === bank.id
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }`}>
                                    {metodePembayaran.virtualAccount === bank.id && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex items-center h-8">
                                    <img
                                        src={bank.logo}
                                        alt={bank.nama}
                                        className="h-8 max-w-[120px] object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pembayaran Instan */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                    Pembayaran Instan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                    {metodeInstan.map((method) => (
                        <div
                            key={method.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${metodePembayaran.pembayaranInstan === method.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            onClick={() => handlePilihInstan(method.id)}
                        >
                            <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${metodePembayaran.pembayaranInstan === method.id
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }`}>
                                    {metodePembayaran.pembayaranInstan === method.id && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex items-center h-8">
                                    <img
                                        src={method.logo}
                                        alt={method.nama}
                                        className="h-8 max-w-[120px] object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Syarat dan Ketentuan */}
            <div className="mb-6">
                <label className="flex items-start">
                    <input
                        type="checkbox"
                        checked={setujuSyarat}
                        onChange={(e) => onSetujuChange(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        Saya telah membaca dan menyetujui{" "}
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            Syarat & Ketentuan
                        </button>
                    </span>
                </label>
            </div>

            {/* Tombol Action */}
            <div className="flex gap-4">
                <button
                    onClick={onBatal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                    Batal
                </button>

                <button
                    onClick={onKonfirmasi}
                    disabled={!setujuSyarat || (!metodePembayaran.virtualAccount && !metodePembayaran.pembayaranInstan)}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${setujuSyarat && (metodePembayaran.virtualAccount || metodePembayaran.pembayaranInstan)
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Konfirmasi Pembayaran
                </button>
            </div>

            {/* MODAL: SYARAT & KETENTUAN RESERVASI */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-blue-700 px-6 md:px-8 py-6 text-white flex items-center justify-between">
                            <h2 className="text-2xl md:text-3xl font-bold">Syarat & Ketentuan Reservasi</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white hover:bg-blue-600 p-2 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto flex-1 px-6 md:px-8 py-6 text-gray-700 text-sm md:text-base">
                            <div className="space-y-4">
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">1. Pemesanan Tiket</h3>
                                    <p className="leading-relaxed">Pemesanan tiket dilakukan melalui platform Jawa Trans. Data penumpang harus sesuai dengan identitas asli. Perubahan data penumpang dapat dilakukan maksimal 24 jam sebelum keberangkatan dengan menghubungi layanan pelanggan kami.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">2. Pembayaran</h3>
                                    <p className="leading-relaxed">Pembayaran harus dilakukan penuh sebelum tiket dicetak atau dikirim. Kami menerima transfer bank, e-wallet, dan QRIS. Bukti pembayaran akan dikirim via email yang terdaftar. Pembayaran tidak dapat dikembalikan setelah konfirmasi transaksi berhasil.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">3. Kebijakan Pembatalan</h3>
                                    <p className="leading-relaxed">
                                        • Pembatalan minimal 24 jam sebelum keberangkatan: Refund 80% dari harga tiket<br/>
                                        • Pembatalan 12-24 jam sebelum keberangkatan: Refund 50% dari harga tiket<br/>
                                        • Pembatalan kurang dari 12 jam sebelum keberangkatan: Tidak dapat dibatalkan (tiket hangus)
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">4. Kehadiran Penumpang</h3>
                                    <p className="leading-relaxed">Penumpang harus tiba di terminal minimal 30 menit sebelum keberangkatan. Penumpang yang tidak hadir 15 menit sebelum keberangkatan dianggap membatalkan perjalanan dan tiket dinyatakan hangus. Tidak ada refund untuk penumpang yang tidak hadir.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">5. Persyaratan Identitas</h3>
                                    <p className="leading-relaxed">Penumpang wajib membawa identitas asli yang sesuai dengan data reservasi (KTP, Paspor, atau SIM). Penumpang tanpa identitas yang sesuai tidak diizinkan naik dan tiket dinyatakan hangus tanpa refund.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">6. Barang Bawaan</h3>
                                    <p className="leading-relaxed">Setiap penumpang diizinkan membawa 1 tas tangan dan 1 koper berukuran standar (maksimal 20 kg per item). Barang-barang berbahaya, cairan mudah terbakar, dan barang terlarang lainnya dilarang. Jawa Trans tidak bertanggung jawab atas kehilangan atau kerusakan barang bawaan.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">7. Perjalanan dan Keselamatan</h3>
                                    <p className="leading-relaxed">Penumpang harus mematuhi peraturan keselamatan selama perjalanan. Dilarang merokok, minum alkohol, dan memainkan musik keras di dalam bus. Pelanggaran dapat mengakibatkan penumpang diturunkan tanpa refund dan pelaporan ke aparat kepolisian.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">8. Keterlambatan</h3>
                                    <p className="leading-relaxed">Jawa Trans berkomitmen untuk ketepatan waktu. Namun, keterlambatan dapat terjadi karena kondisi lalu lintas, cuaca buruk, atau keadaan force majeure. Jika terlambat lebih dari 2 jam, penumpang dapat meminta kompensasi atau pembatalan tanpa denda pembatalan.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">9. Pembatalan oleh Jawa Trans</h3>
                                    <p className="leading-relaxed">Jawa Trans berhak membatalkan perjalanan jika jumlah penumpang kurang dari 50% kapasitas atau karena alasan teknis/keselamatan. Penumpang akan menerima notifikasi cancellation dan full refund atau penawaran alternatif perjalanan lain.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">10. Perlindungan Data</h3>
                                    <p className="leading-relaxed">Data pribadi penumpang dilindungi sesuai dengan undang-undang perlindungan data. Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa persetujuan. Untuk informasi lebih lanjut, silakan baca kebijakan privasi kami.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">11. Hak Penumpang</h3>
                                    <p className="leading-relaxed">Penumpang berhak mendapat pelayanan yang aman, nyaman, dan profesional. Penumpang berhak mengajukan keluhan jika ada ketidaksesuaian layanan dan akan ditangani dalam waktu 7 hari kerja.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">12. Perubahan dan Penerimaan</h3>
                                    <p className="leading-relaxed">Jawa Trans berhak mengubah syarat dan ketentuan kapan saja. Perubahan akan berlaku efektif setelah diumumkan. Penggunaan layanan lebih lanjut berarti Anda menerima perubahan tersebut. Dengan menyetujui syarat ini, Anda telah membaca dan memahami seluruh ketentuan.</p>
                                </section>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 px-6 md:px-8 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-sm"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}