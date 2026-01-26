import { useState, useEffect } from 'react';
import {
    Save,
    Armchair,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function FasilitasForm({
    initialData = {},
    onSubmit,
    isLoading
}) {
    const navigate = useNavigate();
    const isEditMode = !!initialData.idFasilitas;

    const [formData, setFormData] = useState({
        nama: ''
    });

    useEffect(() => {
        if (initialData.idFasilitas) {
            setFormData({
                nama: initialData.nama || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitLocal = (e) => {
        e.preventDefault();

        if (!formData.nama) {
            Swal.fire('Error', 'Nama fasilitas wajib diisi.', 'error');
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmitLocal} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <Armchair className="w-4 h-4 text-slate-400" /> Nama Fasilitas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="Contoh: AC, WiFi, Toilet"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/admin/fasilitas')}
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
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan Fasilitas'}
                </button>
            </div>
        </form>
    );
}
