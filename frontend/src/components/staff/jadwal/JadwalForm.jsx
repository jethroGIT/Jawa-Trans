import { useState, useEffect } from 'react';
import {
    Save, Calendar, MapPin,
    Bus, Banknote, ArrowRight, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function JadwalForm({
    initialData = {},       // Data awal (kosong utk Create, terisi utk Update)
    onSubmit,               // Fungsi parent untuk handle submit
    isLoading,              // Status loading simpan
    listBus = [],           // Data dropdown bus
    listTerminal = [],      // Data dropdown terminal
    isFetchingOptions       // Status loading dropdown
}) {
    const navigate = useNavigate();

    // --- STATE FORM ---
    const [formData, setFormData] = useState({
        idBus: '',
        titik_naik: '',
        titik_turun: '',
        tgl_berangkat: '',
        jam_berangkat: '',
        tgl_datang: '',
        jam_datang: '',
        harga: ''
    });

    // --- POPULATE DATA (Mode Edit) ---
    useEffect(() => {
        if (initialData.idBus) {
            
            // --- FUNGSI HELPER YANG DIPERBAIKI ---
            const splitDateTime = (dateTimeStr) => {
                if (!dateTimeStr) return ['', ''];
                
                let datePart = '';
                let timePart = '';

                // Cek format ISO (mengandung 'T'), contoh: 2025-08-30T08:30:00.000Z
                if (dateTimeStr.includes('T')) {
                    [datePart, timePart] = dateTimeStr.split('T');
                } 
                // Cek format String biasa (mengandung spasi), contoh: 2025-08-30 08:30:00
                else if (dateTimeStr.includes(' ')) {
                    [datePart, timePart] = dateTimeStr.split(' ');
                } 
                // Fallback jika hanya tanggal
                else {
                    datePart = dateTimeStr;
                }

                // Ambil jam saja (HH:mm), buang detik/milidetik jika ada
                // timePart mungkin undefined jika string tanggal saja
                const time = timePart ? timePart.substring(0, 5) : ''; 

                return [datePart, time];
            };
            // -------------------------------------

            // Gunakan helper baru
            // Pastikan key 'jam_keberangkatan' sesuai dengan respon JSON backend Anda
            const [tglB, jamB] = splitDateTime(initialData.jam_keberangkatan || initialData.tanggal_keberangkatan);
            const [tglD, jamD] = splitDateTime(initialData.jam_kedatangan || initialData.tanggal_kedatangan);

            setFormData({
                idBus: initialData.idBus,
                titik_naik: initialData.titik_naik,
                titik_turun: initialData.titik_turun,
                tgl_berangkat: tglB,
                jam_berangkat: jamB,
                tgl_datang: tglD,
                jam_datang: jamD,
                harga: initialData.harga
            });
        }
    }, [initialData]);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Auto-fill tanggal datang sama dengan berangkat (UX Improvement)
        if (name === 'tgl_berangkat' && formData.tgl_datang === '') {
            setFormData(prev => ({ ...prev, [name]: value, tgl_datang: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmitLocal = (e) => {
        e.preventDefault();

        // Validasi
        if (!formData.idBus || !formData.titik_naik || !formData.titik_turun || !formData.harga) {
            Swal.fire('Peringatan', 'Mohon lengkapi semua data wajib.', 'warning');
            return;
        }

        if (parseInt(formData.titik_naik) === parseInt(formData.titik_turun)) {
            Swal.fire('Error', 'Titik naik dan turun tidak boleh sama.', 'error');
            return;
        }

        // Format Payload untuk dikirim ke Parent
        // Menggabungkan Date + Time menjadi format MySQL timestamp
        const payload = {
            idBus: parseInt(formData.idBus),
            titik_naik: parseInt(formData.titik_naik),
            titik_turun: parseInt(formData.titik_turun),

            // Backend biasanya butuh field ini
            tanggal_keberangkatan: formData.tgl_berangkat,
            jam_keberangkatan: `${formData.tgl_berangkat} ${formData.jam_berangkat}:00`,

            tanggal_kedatangan: formData.tgl_datang,
            jam_kedatangan: `${formData.tgl_datang} ${formData.jam_datang}:00`,

            harga: parseInt(formData.harga)
        };

        onSubmit(payload);
    };

    if (isFetchingOptions) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-12 flex items-center justify-center text-slate-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin" /> Memuat data opsi...
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmitLocal} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">

                {/* SECTION 1: ARMADA & RUTE */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <Bus className="w-5 h-5 text-blue-600" />
                        Armada & Rute
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pilih Bus */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Bus</label>
                            <select
                                name="idBus"
                                value={formData.idBus}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                <option value="">-- Pilih Armada --</option>
                                {listBus.map(bus => (
                                    <option key={bus.idBus} value={bus.idBus}>
                                        {bus.kode_bus} - {bus.tipe_bus?.tipe}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Titik Naik */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-green-600" /> Terminal Keberangkatan
                            </label>
                            <select
                                name="titik_naik"
                                value={formData.titik_naik}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                <option value="">-- Pilih Terminal Asal --</option>
                                {listTerminal.map(t => (
                                    <option key={t.idTerminal} value={t.idTerminal}>{t.nama} ({t.kota})</option>
                                ))}
                            </select>
                        </div>

                        {/* Titik Turun */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-600" /> Terminal Tujuan
                            </label>
                            <select
                                name="titik_turun"
                                value={formData.titik_turun}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                <option value="">-- Pilih Terminal Tujuan --</option>
                                {listTerminal.map(t => (
                                    <option key={t.idTerminal} value={t.idTerminal}>{t.nama} ({t.kota})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>


                {/* SECTION 2: WAKTU */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Waktu Perjalanan
                    </h3>

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        {/* Keberangkatan */}
                        <div className="flex-1 w-full bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 block">Waktu Keberangkatan</span>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Tanggal</label>
                                    <input
                                        type="date"
                                        name="tgl_berangkat"
                                        value={formData.tgl_berangkat}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Jam</label>
                                    <input
                                        type="time"
                                        name="jam_berangkat"
                                        value={formData.jam_berangkat}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <ArrowRight className="hidden md:block w-6 h-6 text-slate-300" />

                        {/* Kedatangan */}
                        <div className="flex-1 w-full bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 block">Estimasi Kedatangan</span>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Tanggal</label>
                                    <input
                                        type="date"
                                        name="tgl_datang"
                                        value={formData.tgl_datang}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        required
                                        min={formData.tgl_berangkat}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Jam</label>
                                    <input
                                        type="time"
                                        name="jam_datang"
                                        value={formData.jam_datang}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: HARGA */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-blue-600" />
                        Harga Tiket
                    </h3>
                    <div className="max-w-md">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Harga per Penumpang</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">Rp</span>
                            <input
                                type="number"
                                name="harga"
                                value={formData.harga}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-semibold text-slate-800"
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Harga sudah termasuk pajak dan biaya layanan.</p>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/mitra/jadwal')}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all
                        ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}
                    `}
                >
                    {isLoading ? 'Menyimpan...' : (
                        <>
                            <Save className="w-4 h-4" />
                            Simpan Jadwal
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}