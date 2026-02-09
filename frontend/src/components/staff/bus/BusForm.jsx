import { useState, useEffect } from 'react';
import {
    Save,
    Bus,
    Tag,
    Type,
    Activity,
    Loader2,
    Armchair
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import tipebusService from '../../../services/mitra/tipebusService';

export default function BusForm({
    initialData = {},
    onSubmit,
    isLoading
}) {
    const navigate = useNavigate();
    const isEditMode = !!initialData.idBus;

    const [formData, setFormData] = useState({
        plat_nomor: '',
        kode_bus: '',
        idTipe: '',
        kapasitas: '',
        status: 1 // Default: aktif (1)
    });

    const [tipeBusList, setTipeBusList] = useState([]);
    const [loadingTipe, setLoadingTipe] = useState(true);

    useEffect(() => {
        const loadTipe = async () => {
            try {
                setLoadingTipe(true);
                const data = await tipebusService.fetchAllTipeByMitra();;
                setTipeBusList(data || []);
            } catch (error) {
                console.error('Error loading tipe bus:', error);
                Swal.fire('Error', 'Gagal memuat data tipe bus', 'error');
            } finally {
                setLoadingTipe(false);
            }
        };
        loadTipe();
    }, []);

    useEffect(() => {
        if (initialData.idBus) {
            // Convert status to tinyint if it's a string from backend
            let statusValue = initialData.status;
            if (typeof statusValue === 'string') {
                // Convert string to tinyint
                if (statusValue === 'aktif') statusValue = 1;
                else if (statusValue === 'tidak aktif') statusValue = 0;
                else if (statusValue === 'perbaikan') statusValue = 2;
                else statusValue = 1; // default to aktif
            }

            setFormData({
                plat_nomor: initialData.plat_nomor || '',
                kode_bus: initialData.kode_bus || '',
                idTipe: initialData.idTipe || '',
                kapasitas: initialData.kapasitas || '',
                status: statusValue || 1
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Parse status as integer since it's tinyint in database
        const parsedValue = name === 'status' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmitLocal = (e) => {
        e.preventDefault();
        if (!formData.plat_nomor || !formData.kode_bus || !formData.idTipe || !formData.kapasitas) {
            Swal.fire('Error', 'Mohon lengkapi semua field wajib.', 'error');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmitLocal} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">

                {/* Grid Layout - Menyamping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    {/* Baris 1: Plat Nomor & Kode Bus */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Plat Nomor <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="plat_nomor"
                            value={formData.plat_nomor}
                            onChange={handleChange}
                            placeholder="Contoh: AB 1234 CD"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Kode Bus <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="kode_bus"
                            value={formData.kode_bus}
                            onChange={handleChange}
                            placeholder="Contoh: BUS-001"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    {/* Baris 2: Tipe Kelas & Kapasitas */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Jenis Kendaraan <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idTipe"
                            value={formData.idTipe}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer font-medium"
                            required
                            disabled={loadingTipe}
                        >
                            <option value="">Pilih Jenis Kendaraan</option>
                            {tipeBusList.map((item) => (
                                <option key={item.idTipe} value={item.idTipe}>
                                    {item.tipe}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Kapasitas Penumpang <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="kapasitas"
                            value={formData.kapasitas}
                            onChange={handleChange}
                            placeholder="Contoh: 40"
                            min="1"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    {/* Baris 3: Status (Hanya Muncul saat Edit) */}
                    {isEditMode && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Status Operasional
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`
                                    w-full px-4 py-2.5 border rounded-xl focus:ring-2 outline-none font-bold transition-all
                                    ${formData.status === 1 ? 'bg-green-50 border-green-200 text-green-700' : ''}
                                    ${formData.status === 2 ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}
                                    ${formData.status === 0 ? 'bg-red-50 border-red-200 text-red-700' : ''}
                                `}
                            >
                                <option value={1}>Aktif</option>
                                <option value={2}>Perbaikan</option>
                                <option value={0}>Tidak Aktif</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/mitra/bus')}
                    className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                        flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white shadow-lg transition-all
                        ${isLoading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}
                    `}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEditMode ? 'Simpan Perubahan' : 'Daftarkan Armada'}
                </button>
            </div>
        </form>
    );
}