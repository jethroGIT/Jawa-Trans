import StaffLayout from '../../../layouts/StaffLayout';
import busService from '../../../services/mitra/busService';
import BusForm from '../../../components/staff/bus/BusForm';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';

export default function EditBus() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [busData, setBusData] = useState(null);

    // Fetch Data Bus
    useEffect(() => {
        const loadData = async () => {
            try {
                const busRes = await busService.fetchBusById(id);

                if (busRes) {
                    const data = busRes;

                    setBusData({
                        idBus: data.idBus,
                        plat_nomor: data.plat_nomor,
                        kode_bus: data.kode_bus,
                        idTipe: data.idTipe,
                        kapasitas: data.kapasitas || '',
                        status: data.status
                    });
                }

            } catch (error) {
                console.error("Gagal memuat data:", error);
                Swal.fire({
                    title: "Error",
                    text: "Gagal mengambil data bus. Data mungkin tidak ditemukan.",
                    icon: "error"
                }).then(() => {
                    navigate('/mitra/bus');
                });
            } finally {
                setIsFetching(false);
            }
        };

        loadData();
    }, [id, navigate]);

    // Handler Submit Update
    const handleUpdateSubmit = async (formData) => {
        setIsLoading(true);

        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang menyimpan perubahan',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const payload = {
                idTipe: formData.idTipe,
                plat_nomor: formData.plat_nomor,
                kode_bus: formData.kode_bus,
                status: formData.status
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
                icon: 'error',
                confirmButtonColor: '#DC2626'
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
                        initialData={busData}
                        onSubmit={handleUpdateSubmit}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </StaffLayout>
    );
}