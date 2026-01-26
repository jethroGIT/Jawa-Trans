import StaffLayout from '../../../layouts/StaffLayout';
import jadwalService from '../../../services/mitra/jadwalService';
import JadwalForm from '../../../components/staff/jadwal/JadwalForm';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';

export default function UpdateJadwal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [listBus, setListBus] = useState([]);
    const [listTerminal, setListTerminal] = useState([]);
    const [jadwalData, setJadwalData] = useState(null);

    // Fetch Data Master & Data Detail
    useEffect(() => {
        const loadAllData = async () => {
            try {
                // Fetch Master & Detail Parallel
                const [options, detail] = await Promise.all([
                    jadwalService.fetchCallBusTerminal(),
                    jadwalService.fetchJadwalById(id)
                ]);

                setListBus(options.buses);
                setListTerminal(options.terminals);
                
                // Transform data dari backend ke format form
                if (detail) {
                    const data = detail.jadwal || detail;
                    setJadwalData({
                        idJadwal: data.idJadwal,
                        idBus: data.idBus,
                        titik_naik: data.titik_naik,
                        titik_turun: data.titik_turun,
                        tanggal_keberangkatan: data.tanggal_keberangkatan,
                        jam_keberangkatan: data.jam_keberangkatan,
                        tanggal_kedatangan: data.tanggal_kedatangan,
                        jam_kedatangan: data.jam_kedatangan,
                        harga: data.harga
                    });
                }

            } catch (error) {
                console.error("Gagal memuat data:", error);
                Swal.fire({
                    title: "Error",
                    text: "Gagal mengambil data jadwal. Data mungkin tidak ditemukan.",
                    icon: "error"
                }).then(() => {
                    navigate('/mitra/jadwal');
                });
            } finally {
                setIsFetching(false);
            }
        };
        loadAllData();
    }, [id, navigate]);

    const handleUpdateSubmit = async (payload) => {
        setIsLoading(true);
        
        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang menyimpan perubahan jadwal',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await jadwalService.fetchUpdateJadwal(id, payload);
            
            Swal.fire({
                title: 'Berhasil!',
                text: 'Jadwal berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/mitra/jadwal');
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Gagal!',
                text: error.message || 'Terjadi kesalahan saat memperbarui jadwal.',
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
                        <h1 className="text-2xl font-bold text-slate-800">Edit Jadwal</h1>
                        <p className="text-slate-500 text-sm mt-1">Perbarui informasi perjalanan</p>
                    </div>
                </div>

                {isFetching ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                        <p>Mengambil data jadwal...</p>
                    </div>
                ) : (
                    <JadwalForm
                        initialData={jadwalData}
                        onSubmit={handleUpdateSubmit}
                        isLoading={isLoading}
                        listBus={listBus}
                        listTerminal={listTerminal}
                        isFetchingOptions={false}
                    />
                )}
            </div>
        </StaffLayout>
    );
}