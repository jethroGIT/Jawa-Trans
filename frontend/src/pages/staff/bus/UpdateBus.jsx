import StaffLayout from '../../../layouts/StaffLayout';
import busService from '../../../services/mitra/busService';
import authService from '../../../services/authService';
import BusForm from '../../../components/staff/bus/BusForm'; // Komponen Reusable
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';

export default function EditBus() {
    const { id } = useParams(); // Ambil ID Bus dari URL
    const navigate = useNavigate();

    // State
    const [isLoading, setIsLoading] = useState(false); // Loading saat submit
    const [isFetching, setIsFetching] = useState(true); // Loading saat ambil data awal
    const [fasilitasOptions, setFasilitasOptions] = useState([]);
    const [busData, setBusData] = useState(null); // Data untuk props initialData

    // 1. Fetch Data Master & Data Bus (Concurrent Fetching)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Jalankan kedua request secara paralel agar lebih cepat
                const [fasilitasRes, busRes] = await Promise.all([
                    busService.fetchFasilitas(),
                    busService.fetchBusById(id)
                ]);

                // Set Fasilitas Options
                if (fasilitasRes && Array.isArray(fasilitasRes)) {
                    setFasilitasOptions(fasilitasRes);
                } else if (fasilitasRes.success && Array.isArray(fasilitasRes.data)) {
                    setFasilitasOptions(fasilitasRes.data);
                }

                // Set Initial Data Bus
                // Kita perlu memformat data dari API agar sesuai struktur BusForm
                if (busRes) {
                    // Asumsi busRes.data berisi detail bus
                    // Sesuaikan 'busRes' atau 'busRes.data' tergantung struktur response backend Anda
                    const data = busRes;

                    setBusData({
                        idMitra: data.idMitra,
                        kode_bus: data.kode_bus,
                        type: data.type,
                        kapasitas: data.kapasitas,
                        status: data.status,
                        // Pastikan fasilitas dari API diubah jadi array ID: [1, 2]
                        // Jika API mengembalikan array object [{id:1, name:'AC'}], map dulu ke id
                        fasilitas: data.fasilitas ? data.fasilitas.map(f => typeof f === 'object' ? f.idFasilitas : f) : [],
                        // Foto lama (URL string)
                        fotos: data.foto_bus ? data.foto_bus.map(f => f.url) : []
                    });
                }

            } catch (error) {
                console.error("Gagal memuat data:", error);
                Swal.fire({
                    title: "Error",
                    text: "Gagal mengambil data bus. Data mungkin tidak ditemukan.",
                    icon: "error"
                }).then(() => {
                    navigate('/mitra/bus'); // Kembali jika error
                });
            } finally {
                setIsFetching(false);
            }
        };

        loadData();
    }, [id, navigate]);

    // 2. Handler Submit Update
    const handleUpdateSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const user = authService.getUser();

            // Payload
            const payload = {
                idMitra: user.idMitra,
                kode_bus: formData.kode_bus,
                type: formData.type,
                kapasitas: formData.kapasitas,
                fasilitas: formData.fasilitas,
                fotos: formData.fotos, // Array File Baru
                existingPhotos: formData.existingPhotos // Array URL Foto Lama
            };

            await busService.fetchUpdateBus(id, payload);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Data armada berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/mitra/bus');
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Gagal!',
                text: error.message || 'Terjadi kesalahan saat mengupdate data.',
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StaffLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Edit Armada</h1>
                        <p className="text-slate-500 text-sm mt-1">Perbarui informasi dan fasilitas bus</p>
                    </div>
                </div>

                {isFetching ? (
                    // Tampilan Loading saat Fetch Data Awal
                    <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                        <p>Mengambil data armada...</p>
                    </div>
                ) : (
                    // Tampilkan Form jika data sudah siap
                    <BusForm
                        initialData={busData} // Kirim data bus yg diambil dari API
                        onSubmit={handleUpdateSubmit}
                        isLoading={isLoading}
                        fasilitasOptions={fasilitasOptions}
                        isFetchingFasilitas={false} // Sudah diload di useEffect parent
                    />
                )}
            </div>
        </StaffLayout>
    );
}