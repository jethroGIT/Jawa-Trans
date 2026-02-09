import { useState, useRef, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, Camera, Save } from 'lucide-react';

export default function MitraForm({ initialData = {}, onSubmit, isSaving }) {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({ nama: '', email: '', telephone: '', alamat: '' });
    const [previewLogo, setPreviewLogo] = useState('');
    const [newLogoFile, setNewLogoFile] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                nama: initialData.nama || '',
                email: initialData.email || '',
                telephone: initialData.telephone || '',
                alamat: initialData.alamat || ''
            });
            // Prefer full URL provided by backend (logoURL). Fallback to filename (logo) only if URL absent.
            setPreviewLogo(initialData.logoURL || initialData.logo || '');
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        // prepare FormData
        const payload = new FormData();
        payload.append('nama', formData.nama);
        payload.append('email', formData.email);
        payload.append('telephone', formData.telephone);
        payload.append('alamat', formData.alamat);
        if (newLogoFile) payload.append('logo', newLogoFile);

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmitLocal} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Form Mitra</h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola data mitra</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex flex-col items-center gap-4 lg:w-1/3">
                        <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-inner flex items-center justify-center bg-white relative group" onClick={() => fileInputRef.current.click()}>
                            {previewLogo ? (
                                <img src={previewLogo} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center text-slate-300">
                                    <Building2 className="w-16 h-16 mb-2" /><span className="text-xs">No Logo</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Perusahaan</label>
                            <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Telephone</label>
                                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Alamat</label>
                            <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => window.history.back()} className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200">Batal</button>
                            <button type="submit" disabled={isSaving} className={`px-6 py-2 rounded-xl text-sm font-medium text-white ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {isSaving ? 'Menyimpan...' : <><Save className="w-4 h-4 inline-block mr-2" />Simpan</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
