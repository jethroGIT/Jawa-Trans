import StaffLayout from '../../../layouts/StaffLayout';
import jadwalService from '../../../services/mitra/jadwalService';
import JadwalForm from '../../../components/staff/jadwal/JadwalForm'; // Import komponen form
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateJadwal() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingOptions, setIsFetchingOptions] = useState(true);

    // Data Master
    const [listBus, setListBus] = useState([]);
    const [listTerminal, setListTerminal] = useState([]);

    // 1. Fetch Data Master (Bus & Terminal)
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const data = await jadwalService.fetchCallBusTerminal();
                setListBus(data.buses);
                setListTerminal(data.terminals);
            } catch (error) {
                Swal.fire("Error", "Gagal memuat data bus/terminal", "error");
            } finally {
                setIsFetchingOptions(false);
            }
        };
        fetchMasterData();
    }, []);

    // Handler Submit (Khusus Create)
    const handleCreateSubmit = async (payload) => {
        setIsLoading(true);
        
        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang menyimpan jadwal perjalanan',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await jadwalService.fetchCreateJadwal(payload);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Jadwal perjalanan baru telah dibuat.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/mitra/jadwal');
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Gagal!',
                text: error.message || 'Terjadi kesalahan saat menyimpan jadwal.',
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
                        <h1 className="text-2xl font-bold text-slate-800">Buat Jadwal Baru</h1>
                        <p className="text-slate-500 text-sm mt-1">Atur rute, armada, dan harga tiket perjalanan</p>
                    </div>
                </div>

                {/* Panggil Komponen Reusable */}
                <JadwalForm
                    initialData={{}} // Kosong karena Create
                    onSubmit={handleCreateSubmit}
                    isLoading={isLoading}
                    listBus={listBus}
                    listTerminal={listTerminal}
                    isFetchingOptions={isFetchingOptions}
                />
            </div>
        </StaffLayout>
    );
}