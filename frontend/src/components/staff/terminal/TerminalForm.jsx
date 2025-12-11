import { useState, useEffect } from 'react';
import {
    Save, MapPin, Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function TerminalForm({
    initialData = {}, // Data lama (jika mode edit, akan terisi)
    onSubmit,         // Fungsi handler yang dikirim dari Parent Page
    isLoading         // Status loading untuk disable tombol simpan
}) {
    const navigate = useNavigate();

    // --- STATE FORM ---
    const [formData, setFormData] = useState({
        kota: '',
        nama: ''
    });

    // --- EFFECT: POPULATE DATA (Mode Edit) ---
    // Jika initialData berubah (misal setelah fetch data selesai), isi form
    useEffect(() => {
        if (initialData.nama) {
            setFormData({
                kota: initialData.kota || '',
                nama: initialData.nama || ''
            });
        }
    }, [initialData]);

    // --- HANDLERS ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitLocal = (e) => {
        e.preventDefault();

        // Validasi Sederhana
        if (!formData.kota || !formData.nama) {
            Swal.fire({
                title: 'Peringatan',
                text: 'Mohon lengkapi Kota dan Nama Terminal.',
                icon: 'warning',
                confirmButtonColor: '#2563EB'
            });
            return;
        }

        // Kirim data ke Parent Component (CreateTerminal / UpdateTerminal)
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmitLocal} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">

                {/* Section Input */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Informasi Terminal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input Kota */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Kota / Lokasi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="kota"
                                    value={formData.kota}
                                    onChange={handleChange}
                                    placeholder="Contoh: Surabaya"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Nama Terminal */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nama Terminal <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    placeholder="Contoh: Terminal Bungurasih"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Action */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/mitra/terminal')}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all
                        ${isLoading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'}
                    `}
                >
                    {isLoading ? (
                        'Menyimpan...'
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Simpan Data
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}