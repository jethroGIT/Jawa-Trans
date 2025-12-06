// components/detail-jadwal/OrderCard.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import reservasiService from "../../services/reservasiService";
import authService from "../../services/authService";
import Swal from "sweetalert2";

export default function OrderCard({ jadwal }) {
    const query = new URLSearchParams(useLocation().search);
    const navigate = useNavigate();
    const jumlahPenumpang = parseInt(query.get("penumpang")) || 1;

    const [penumpang, setPenumpang] = useState(Array(jumlahPenumpang).fill(""));
    const [kursiTerpilih, setKursiTerpilih] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Data kursi dengan kapasitas dari jadwal
    const totalKursi = jadwal?.bus?.kapasitas || 20;
    const semuaKursi = Array.from({ length: totalKursi }, (_, i) => i + 1);
    const kursiTerjual = jadwal?.kursiTerjual || []; // Dari API backend
    const kursiTersedia = jadwal?.kursiTersedia || totalKursi;

    const handlePilihKursi = (nomorKursi) => {
        // Cek apakah kursi sudah terjual (handle string dan number)
        const isTerjual = kursiTerjual.some(k =>
            String(k) === String(nomorKursi) ||
            k === nomorKursi ||
            parseInt(k) === nomorKursi
        );

        if (isTerjual) return;

        setKursiTerpilih(prev => {
            if (prev.includes(nomorKursi)) {
                return prev.filter(k => k !== nomorKursi);
            } else if (prev.length < jumlahPenumpang) {
                return [...prev, nomorKursi];
            }
            return prev;
        });
    };

    const handleNamaChange = (index, nama) => {
        const newPenumpang = [...penumpang];
        newPenumpang[index] = nama;
        setPenumpang(newPenumpang);
    };

    const getKursiStatus = (nomorKursi) => {
        // Cek apakah kursi terjual (handle berbagai format)
        const isTerjual = kursiTerjual.some(k =>
            String(k) === String(nomorKursi) ||
            k === nomorKursi ||
            parseInt(k) === nomorKursi
        );

        if (isTerjual) return "terjual";
        if (kursiTerpilih.includes(nomorKursi)) return "terpilih";
        return "tersedia";
    };

    const handleLanjut = () => {
        if (kursiTerpilih.length === jumlahPenumpang) {
            // Validasi nama penumpang
            const namaKosong = penumpang.some(nama => !nama.trim());
            if (namaKosong) {
                alert("Mohon isi semua nama penumpang");
                return;
            }

            // Siapkan data untuk halaman pembayaran
            const user = authService.getUser();
            const reservasiData = {
                // Data Jadwal
                idJadwal: jadwal?.idJadwal,
                terminalAsal: jadwal?.terminalNaik?.nama || "Terminal Asal",
                terminalTujuan: jadwal?.terminalTurun?.nama || "Terminal Tujuan",
                tanggal: new Date(jadwal?.tanggal_keberangkatan).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),
                hari: new Date(jadwal?.tanggal_keberangkatan).toLocaleDateString('id-ID', { weekday: 'long' }),
                jamKeberangkatan: new Date(jadwal?.jam_keberangkatan).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),

                // Data Pemesan
                idUser: user.idUser,
                namaPemesan: user.nama,
                emailPemesan: user.email,
                teleponPemesan: user.telephone,

                // Data Penumpang
                penumpang: penumpang.map((nama, index) => ({
                    nama: nama.trim(),
                    kursi: String(kursiTerpilih[index])
                })),
                namaPenumpang: penumpang.map(nama => nama.trim()),
                kursi: kursiTerpilih.map(k => String(k)),

                // Data Harga
                hargaTiket: jadwal?.harga || 0,
                jumlahPenumpang: jumlahPenumpang,
                totalHarga: (jadwal?.harga || 0) * jumlahPenumpang
            };

            // Navigate ke halaman payment dengan data
            navigate('/payment', { 
                state: { reservasiData } 
            });
        }
    };

    const handleKembali = () => {
        navigate(-1);
    };

    // Membuat layout kursi bus (2-2 dengan lorong tengah)
    const getKursiLayout = () => {
        const jumlahBaris = Math.ceil(totalKursi / 4);
        const layout = [];

        for (let baris = 0; baris < jumlahBaris; baris++) {
            const barisKursi = [];
            // Kolom kiri (2 kursi)
            for (let i = 0; i < 2; i++) {
                const nomorKursi = baris * 4 + i + 1;
                if (nomorKursi <= totalKursi) {
                    barisKursi.push(nomorKursi);
                }
            }
            // Lorong (null)
            barisKursi.push(null);
            // Kolom kanan (2 kursi)
            for (let i = 2; i < 4; i++) {
                const nomorKursi = baris * 4 + i + 1;
                if (nomorKursi <= totalKursi) {
                    barisKursi.push(nomorKursi);
                }
            }
            layout.push(barisKursi);
        }

        return layout;
    };

    const kursiLayout = getKursiLayout();

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            {/* Form Nama Penumpang */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Penumpang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {penumpang.map((nama, index) => (
                        <div key={index} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Penumpang {index + 1}
                            </label>
                            <input
                                type="text"
                                value={nama}
                                onChange={(e) => handleNamaChange(index, e.target.value)}
                                placeholder="Masukkan nama lengkap"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Pilih Kursi Section */}
            <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Pilih Kursi</h3>
                    <div className="text-sm">
                        <span className="text-gray-600">Tersedia: </span>
                        <span className="font-bold text-green-600">{kursiTersedia}</span>
                        <span className="text-gray-400 mx-2">/</span>
                        <span className="text-gray-600">Total: </span>
                        <span className="font-bold text-gray-800">{totalKursi}</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    Pilih {jumlahPenumpang} kursi untuk perjalanan Anda
                </p>

                {/* Status Legend */}
                <div className="flex flex-wrap gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                        <span className="text-gray-600">Tersedia</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        <span className="text-gray-600">Terpilih</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-gray-600">Terjual</span>
                    </div>
                </div>

                {/* Layout Bus */}
                <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-8 mb-6">
                    {/* Bagian Depan Bus (Setir) */}
                    <div className="flex justify-start mb-6 pl-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="9" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                                Depan Bus
                            </div>
                        </div>
                    </div>

                    {/* Grid Kursi */}
                    <div className="mt-8 space-y-3">
                        {kursiLayout.map((baris, barisIndex) => (
                            <div key={barisIndex} className="flex justify-center gap-3">
                                {baris.map((nomorKursi, colIndex) => {
                                    if (nomorKursi === null) {
                                        // Lorong tengah
                                        return (
                                            <div key={`lorong-${barisIndex}-${colIndex}`} className="w-8">
                                                {barisIndex === 0 && (
                                                    <div className="text-xs text-gray-400 text-center">
                                                        Lorong
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    const status = getKursiStatus(nomorKursi);
                                    return (
                                        <KursiItem
                                            key={nomorKursi}
                                            nomor={nomorKursi}
                                            status={status}
                                            onPilih={handlePilihKursi}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Kursi Terpilih */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Kursi Terpilih
                            </p>
                            <p className="text-lg font-bold text-blue-600 mt-1">
                                {kursiTerpilih.length > 0
                                    ? `No. ${kursiTerpilih.sort((a, b) => a - b).join(", ")}`
                                    : "Belum ada kursi dipilih"
                                }
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Progress</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {kursiTerpilih.length}/{jumlahPenumpang}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tombol Action */}
                <div className="flex gap-4">
                    <button
                        onClick={handleKembali}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Batal
                    </button>

                    <button
                        onClick={handleLanjut}
                        disabled={kursiTerpilih.length !== jumlahPenumpang}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${kursiTerpilih.length === jumlahPenumpang
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Lanjut ke Pembayaran
                    </button>
                </div>
            </div>
        </div>
    );
};

// Komponen Kursi
function KursiItem({ nomor, status, onPilih }) {
    const getKursiClass = () => {
        const baseClass = "w-14 h-14 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200";

        switch (status) {
            case "tersedia":
                return `${baseClass} bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50 cursor-pointer`;
            case "terpilih":
                return `${baseClass} bg-blue-600 text-white shadow-lg scale-105 cursor-pointer`;
            case "terjual":
                return `${baseClass} bg-red-500 text-white cursor-not-allowed opacity-60`;
            default:
                return `${baseClass} bg-white border-2 border-gray-300 text-gray-700`;
        }
    };

    return (
        <button
            onClick={() => onPilih(nomor)}
            disabled={status === "terjual"}
            className={getKursiClass()}
            title={`Kursi ${nomor} - ${status === 'terjual' ? 'Sudah Terjual' : status === 'terpilih' ? 'Dipilih' : 'Tersedia'}`}
        >
            {nomor}
        </button>
    );
}