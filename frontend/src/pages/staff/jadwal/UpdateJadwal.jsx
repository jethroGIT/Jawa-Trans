import StaffLayout from '../../../layouts/StaffLayout';
import jadwalService from '../../../services/mitra/jadwalService';
import JadwalForm from '../../../components/staff/jadwal/JadwalForm';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UpdateJadwal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);

    // Data
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
                    jadwalService.fetchJadwalById(id) // Asumsi fungsi ini ada di service
                ]);

                setListBus(options.buses);
                setListTerminal(options.terminals);
                setJadwalData(detail);

            } catch (error) {
                Swal.fire("Error", "Gagal memuat data.", "error");
                navigate('/mitra/jadwal');
            } finally {
                setIsFetchingData(false);
            }
        };
        loadAllData();
    }, [id, navigate]);

    const handleUpdateSubmit = async (payload) => {
        setIsLoading(true);
        try {
            await jadwalService.fetchUpdateJadwal(id, payload);
            Swal.fire('Berhasil!', 'Jadwal diperbarui.', 'success')
                .then(() => navigate('/mitra/jadwal'));
        } catch (error) {
            Swal.fire('Gagal', error.message, 'error');
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

                {!isFetchingData && (
                    <JadwalForm
                        initialData={jadwalData} // Kirim data lama
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