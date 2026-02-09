import { useState, useRef, useEffect } from 'react';
import {
    Building2, MapPin, Phone, Mail, Camera,
    Save, X, Pencil
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProfileForm({
    initialData = {}, // Data profil dari API
    onSubmit,         // Fungsi submit ke API
    isSaving          // Status loading saat simpan
}) {
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);

    // State Form Lokal
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        telephone: '',
        alamat: '',
        logo: '', // URL dari DB
    });

    const [previewLogo, setPreviewLogo] = useState('');
    const [newLogoFile, setNewLogoFile] = useState(null);

    // Populate data saat initialData berubah (selesai loading)
    console.log(initialData);
    useEffect(() => {
        if (initialData) {
            setFormData({
                nama: initialData.nama || '',
                email: initialData.email || '',
                telephone: initialData.telephone || '',
                alamat: initialData.alamat || '',
                // keep raw logo for form payload if needed
                logo: initialData.logo || initialData.logoURL || ''
            });
            // Prefer backend-provided full URL when available
            setPreviewLogo(initialData.logoURL || initialData.logo || '');
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewLogoFile(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleSubmitLocal = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Simpan Perubahan?',
            text: "Pastikan data profil sudah benar.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            // Siapkan payload FormData di sini agar parent terima data matang
            const payload = new FormData();
            payload.append('nama', formData.nama);
            payload.append('email', formData.email);
            payload.append('telephone', formData.telephone);
            payload.append('alamat', formData.alamat);

            if (newLogoFile) {
                payload.append('logo', newLogoFile);
            }

            // Kirim ke parent
            // Tunggu parent selesai submit, baru matikan mode edit
            const success = await onSubmit(payload);
            if (success) {
                setIsEditing(false);
                setNewLogoFile(null); // Reset file input
            }
        }
    };

    const handleCancel = () => {
        setPreviewLogo(formData.logo); // Kembalikan ke logo DB
        setNewLogoFile(null);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">

            {/* Header dengan Tombol Edit */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Profil Perusahaan</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola identitas dan kontak mitra</p>
                </div>

                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-all">
                        <Pencil className="w-4 h-4" /> Edit Profil
                    </button>
                ) : (
                    <button onClick={handleCancel} className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
                        <X className="w-4 h-4" /> Batal
                    </button>
                )}
            </div>

            {/* Form Container */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <form onSubmit={handleSubmitLocal} className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Kolom Kiri: Logo */}
                        <div className="flex flex-col items-center gap-4 lg:w-1/3">
                            <div
                                className={`w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-inner flex items-center justify-center bg-white relative group ${isEditing ? 'cursor-pointer hover:border-blue-100' : ''}`}
                                onClick={() => isEditing && fileInputRef.current.click()}
                            >
                                {previewLogo ? (
                                    <img src={previewLogo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-300">
                                        <Building2 className="w-16 h-16 mb-2" /><span className="text-xs">No Logo</span>
                                    </div>
                                )}
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white mb-2" /><span className="text-white text-xs font-medium">Ubah Logo</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                            <div className="text-center">
                                <h3 className="text-lg font-bold text-slate-800">{formData.nama || 'Nama Perusahaan'}</h3>
                                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">Akun Mitra Terverifikasi</span>
                            </div>
                        </div>

                        {/* Kolom Kanan: Input Fields */}
                        <div className="flex-1 space-y-6">
                            <div className="lg:hidden border-t border-slate-100 my-4"></div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Perusahaan</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building2 className="h-5 w-5 text-slate-400" /></div>
                                    <input type="text" name="nama" value={formData.nama} onChange={handleChange} disabled={!isEditing} className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm transition-colors ${isEditing ? 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'}`} placeholder="Masukkan nama perusahaan" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Resmi</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm transition-colors ${isEditing ? 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'}`} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-slate-400" /></div>
                                        <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} disabled={!isEditing} className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm transition-colors ${isEditing ? 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'}`} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Alamat Kantor</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none"><MapPin className="h-5 w-5 text-slate-400" /></div>
                                    <textarea name="alamat" rows="4" value={formData.alamat} onChange={handleChange} disabled={!isEditing} className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm transition-colors ${isEditing ? 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed resize-none'}`}></textarea>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" disabled={isSaving} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                        {isSaving ? 'Menyimpan...' : <><Save className="w-5 h-5" /> Simpan Perubahan</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}