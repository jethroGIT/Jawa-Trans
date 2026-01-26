import StaffLayout from '../../../layouts/StaffLayout';
import terminalService from '../../../services/mitra/terminalService';
import TerminalForm from '../../../components/staff/terminal/TerminalForm'; // Import komponen form reusable
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateTerminal() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Handler Submit (Khusus Create)
    const handleCreateSubmit = async (formData) => {
        setIsLoading(true);
        
        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang menyimpan data terminal',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Panggil Service API
            await terminalService.fetchCreateTerminal(formData);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Terminal baru berhasil ditambahkan.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/mitra/terminal'); // Redirect ke halaman index
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Gagal!',
                text: error.message || 'Terjadi kesalahan saat menyimpan data.',
                icon: 'error',
                confirmButtonColor: '#DC2626'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StaffLayout>
            <div className="space-y-6 max-w-4xl mx-auto">

                {/* Header Page */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Tambah Terminal</h1>
                        <p className="text-slate-500 text-sm mt-1">Daftarkan terminal baru sebagai titik keberangkatan atau tujuan</p>
                    </div>
                </div>

                {/* Panggil Form Reusable */}
                <TerminalForm
                    initialData={{}} // Data kosong untuk Create
                    onSubmit={handleCreateSubmit}
                    isLoading={isLoading}
                />
            </div>
        </StaffLayout>
    );
}