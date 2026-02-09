import { useState, useEffect } from 'react';
import {
    Save,
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Shield,
    Building2,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import userMitraService from '../../../services/admin/userMitraService';

export default function UserForm({
    initialData = {},
    onSubmit,
    isLoading
}) {
    const navigate = useNavigate();
    const isEditMode = !!initialData.idEmployee;

    const [formData, setFormData] = useState({
        nama: '',
        nik: '',
        email: '',
        password: '',
        telephone: '',
        alamat: '',
        idRole: '',
        idMitra: ''
    });

    const [roles, setRoles] = useState([]);
    const [mitras, setMitras] = useState([]);
    const [loadingMaster, setLoadingMaster] = useState(true);

    useEffect(() => {
        const loadMasterData = async () => {
            try {
                setLoadingMaster(true);
                const [rolesData, mitrasData] = await Promise.all([
                    userMitraService.getAllRoles(),
                    userMitraService.getAllMitras()
                ]);
                setRoles(rolesData || []);
                setMitras(mitrasData || []);
            } catch (error) {
                console.error('Error loading master data:', error);
                Swal.fire('Error', 'Gagal memuat data role/mitra', 'error');
            } finally {
                setLoadingMaster(false);
            }
        };
        loadMasterData();
    }, []);

    useEffect(() => {
        if (initialData.idEmployee) {
            setFormData({
                nama: initialData.nama || '',
                nik: initialData.nik || '',
                email: initialData.email || '',
                // Password tidak diisi saat edit kecuali user mau ubah
                password: '',
                telephone: initialData.telephone || '',
                alamat: initialData.alamat || '',
                idRole: initialData.idRole || '',
                idMitra: initialData.idMitra || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitLocal = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.nama || !formData.nik || !formData.email || !formData.telephone || !formData.idRole || !formData.idMitra) {
            Swal.fire('Error', 'Mohon lengkapi field wajib.', 'error');
            return;
        }

        if (!isEditMode && !formData.password) {
            Swal.fire('Error', 'Password wajib diisi untuk user baru.', 'error');
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmitLocal} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Information User */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <User className="w-4 h-4 text-slate-400" /> Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="Contoh: John Doe"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <User className="w-4 h-4 text-slate-400" /> NIK <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nik"
                            value={formData.nik}
                            onChange={handleChange}
                            placeholder="Contoh: 3201234567890001"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <Mail className="w-4 h-4 text-slate-400" /> Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Contoh: john@example.com"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <Phone className="w-4 h-4 text-slate-400" /> Telepon <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            placeholder="Contoh: 08123456789"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <Lock className="w-4 h-4 text-slate-400" /> Password {isEditMode && <span className="text-xs text-slate-400 font-normal">(Kosongkan jika tidak ubah)</span>} <span className={isEditMode ? "hidden" : "text-red-500"}>*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="******"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required={!isEditMode}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-slate-400" /> Alamat
                        </label>
                        <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            placeholder="Alamat lengkap..."
                            rows="2"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <Shield className="w-4 h-4 text-slate-400" /> Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idRole"
                            value={formData.idRole}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer font-medium"
                            required
                            disabled={loadingMaster}
                        >
                            <option value="">Pilih Role</option>
                            {roles.map((item) => (
                                <option key={item.idRole} value={item.idRole}>
                                    {item.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-slate-400" /> Mitra <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idMitra"
                            value={formData.idMitra}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer font-medium"
                            required
                            disabled={loadingMaster}
                        >
                            <option value="">Pilih Mitra</option>
                            {mitras.map((item) => (
                                <option key={item.idMitra} value={item.idMitra}>
                                    {item.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/admin/user-mitra')}
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
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan User'}
                </button>
            </div>
        </form>
    );
}
