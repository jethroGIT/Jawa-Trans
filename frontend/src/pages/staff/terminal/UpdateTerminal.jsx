import StaffLayout from '../../../layouts/StaffLayout';
import terminalService from '../../../services/mitra/terminalService';
import TerminalForm from '../../../components/staff/terminal/TerminalForm'; // Import komponen form
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';

export default function UpdateTerminal() {
    const { id } = useParams(); // Ambil ID dari URL
    const navigate = useNavigate();

    // State
    const [isLoading, setIsLoading] = useState(false); // Loading saat simpan
    const [isFetching, setIsFetching] = useState(true); // Loading saat ambil data awal
    const [terminalData, setTerminalData] = useState(null); // Data untuk form

    // 1. Fetch Data Terminal saat halaman dimuat
    useEffect(() => {
        const loadTerminal = async () => {
            try {
                const response = await terminalService.fetchTerminalById(id);

                if (response) {
                    setTerminalData({
                        kota: response.kota,
                        nama: response.nama
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Gagal mengambil data terminal.",
                    icon: "error"
                }).then(() => {
                    navigate('/mitra/terminal'); 
                });
            } finally {
                setIsFetching(false);
            }
        };

        loadTerminal();
    }, [id, navigate]);

    // 2. Handler Submit Update
    const handleUpdateSubmit = async (formData) => {
        setIsLoading(true);
        try {
            // Panggil fungsi update di service
            // Note: Pastikan nama fungsi di service Anda 'updateTerminal' atau 'fetchUpdateTerminal'
            await terminalService.fetchUpdateTerminal(id, formData);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Data terminal berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/mitra/terminal');
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
            <div className="space-y-6 max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Edit Terminal</h1>
                        <p className="text-slate-500 text-sm mt-1">Perbarui informasi lokasi terminal</p>
                    </div>
                </div>

                {/* Konten */}
                {isFetching ? (
                    // Tampilan Loading
                    <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                        <p>Mengambil data terminal...</p>
                    </div>
                ) : (
                    // Tampilkan Form
                    <TerminalForm
                        initialData={terminalData} // Mengirim data lama ke form
                        onSubmit={handleUpdateSubmit}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </StaffLayout>
    );
}