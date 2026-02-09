import { useState, useRef, useEffect } from 'react';
import {
    Save,
    X,
    UploadCloud,
    Image as ImageIcon,
    Bus,
    Armchair,
    CheckCircle2,
    Loader2,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function BusForm({
    initialData = {}, // Data awal (kosong jika create, terisi jika edit)
    onSubmit,         // Fungsi handler submit dari parent
    isLoading,        // Status loading saat submit
    fasilitasOptions, // Data master fasilitas dari API
    isFetchingFasilitas // Status loading fasilitas
}) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    // --- DETEKSI MODE EDIT ---
    // Jika initialData punya tipe, anggap ini mode Edit
    const isEditMode = !!initialData.tipe;

    // --- STATE FORM ---
    // Gunakan initialData jika ada, atau default value kosong
    const [formData, setFormData] = useState({
        tipe: initialData.tipe || ''
    });

    // State Fasilitas & Foto
    const [selectedFasilitas, setSelectedFasilitas] = useState(initialData.fasilitas || []);
    const [photos, setPhotos] = useState([]); // Array File baru yg diupload
    const [photoPreviews, setPhotoPreviews] = useState([]); // Preview foto baru
    const [existingPhotos, setExistingPhotos] = useState(initialData.existingPhotos || []); // Foto lama (URL dari DB)

    // Update state jika initialData berubah (misal saat data edit baru selesai di-fetch)
    useEffect(() => {
        if (initialData.tipe) {
            setFormData({
                tipe: initialData.tipe || ''
            });
        }
    }, [initialData]);

    // --- HANDLERS ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleFasilitas = (idFasilitas) => {
        if (selectedFasilitas.includes(idFasilitas)) {
            setSelectedFasilitas(selectedFasilitas.filter(id => id !== idFasilitas));
        } else {
            setSelectedFasilitas([...selectedFasilitas, idFasilitas]);
        }
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const totalCurrentPhotos = existingPhotos.length + photos.length + files.length;

        if (totalCurrentPhotos > 5) {
            Swal.fire({
                icon: 'error',
                title: 'Batas Maksimum',
                text: 'Maksimal hanya boleh ada 5 foto armada.',
                confirmButtonColor: '#2563EB'
            });
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPhotos([...photos, ...files]);
        setPhotoPreviews([...photoPreviews, ...newPreviews]);
    };

    const removeNewPhoto = (index) => {
        const newPhotos = [...photos];
        const newPreviews = [...photoPreviews];
        newPhotos.splice(index, 1);
        newPreviews.splice(index, 1);
        setPhotos(newPhotos);
        setPhotoPreviews(newPreviews);
    };

    const removeExistingPhoto = (index) => {
        const newExisting = [...existingPhotos];
        newExisting.splice(index, 1);
        setExistingPhotos(newExisting);
        // TODO: Anda mungkin perlu logic tambahan untuk menghapus foto di server juga jika diperlukan
    };

    const handleSubmitLocal = (e) => {
        e.preventDefault();

        // Validasi
        if (!formData.tipe) {
            Swal.fire('Error', 'Mohon lengkapi Nama Tipe Bus.', 'error');
            return;
        }

        // Validasi foto untuk CREATE mode
        if (!isEditMode && photos.length < 1) {
            Swal.fire('Error', 'Minimal harus ada 1 foto armada untuk membuat tipe bus baru.', 'error');
            return;
        }

        // Kirim data ke parent component
        onSubmit({
            ...formData,
            fasilitas: selectedFasilitas,
            fotos: photos, // File baru
            existingPhotos: existingPhotos // Foto lama yg dipertahankan
        });
    };

    return (
        <form onSubmit={handleSubmitLocal} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">

                {/* SECTION 1: INFORMASI DASAR */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Bus className="w-5 h-5 text-blue-600" />
                        Informasi Tipe Bus
                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nama Tipe Bus <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="tipe"
                            value={formData.tipe}
                            onChange={handleChange}
                            placeholder="Contoh: Ekonomi, Bisnis, Super Executive"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                {/* SECTION 2: FASILITAS */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Armchair className="w-5 h-5 text-blue-600" />
                        Fasilitas
                    </h3>

                    {isFetchingFasilitas ? (
                        <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sedang memuat data fasilitas...
                        </div>
                    ) : fasilitasOptions.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {fasilitasOptions.map((item) => {
                                const isSelected = selectedFasilitas.includes(item.idFasilitas);
                                return (
                                    <button
                                        key={item.idFasilitas}
                                        type="button"
                                        onClick={() => toggleFasilitas(item.idFasilitas)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border
                                            ${isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}
                                        `}
                                    >
                                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                        {item.nama}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-red-500">Tidak ada data fasilitas yang tersedia.</p>
                    )}
                    <p className="text-xs text-slate-400 mt-3">* Klik untuk memilih fasilitas yang tersedia.</p>
                </div>

                {/* SECTION 3: UPLOAD FOTO */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                            Foto Armada
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            {existingPhotos.length + photos.length} / 5 Uploaded
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Tombol Tambah Foto */}
                        {(existingPhotos.length + photos.length) < 5 && (
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2" />
                                <span className="text-xs text-slate-500 group-hover:text-blue-600 font-medium">Tambah Foto</span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoChange}
                                />
                            </div>
                        )}

                        {/* Foto Lama (Existing) */}
                        {existingPhotos.map((url, index) => (
                            <div key={`exist-${index}`} className="relative aspect-square group">
                                {/* Asumsi URL valid, bisa tambah placeholder onError */}
                                <img src={url} alt={`Existing ${index}`} className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm" />
                                <button
                                    type="button"
                                    onClick={() => removeExistingPhoto(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md z-10 hover:bg-red-600 transition-colors"
                                    title="Hapus Foto"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded">Lama</span>
                            </div>
                        ))}

                        {/* Foto Baru (Preview) */}
                        {photoPreviews.map((src, index) => (
                            <div key={`new-${index}`} className="relative aspect-square group">
                                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm" />
                                <button
                                    type="button"
                                    onClick={() => removeNewPhoto(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md z-10 hover:bg-red-600 transition-colors"
                                    title="Hapus Foto"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-500/80 text-white text-[10px] rounded">Baru</span>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="border-slate-100" />

            </div>

            {/* Footer Action */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/mitra/jenis-kendaraan')}
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
                    {isLoading ? 'Processing...' : (
                        <>
                            <Save className="w-4 h-4" />
                            Simpan Tipe Bus
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}