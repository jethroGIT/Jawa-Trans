import StaffLayout from '../../../layouts/StaffLayout';
import busService from '../../../services/mitra/busService';
import BusForm from '../../../components/staff/bus/BusForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateBus() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Handler Submit untuk CREATE
    const handleCreateSubmit = async (formData) => {
        setIsLoading(true);

        // Tampilkan loading alert
        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang menyimpan data armada',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const payload = {
                plat_nomor: formData.plat_nomor,
                kode_bus: formData.kode_bus,
                idTipe: formData.idTipe,
                kapasitas: formData.kapasitas
            };

            const result = await busService.fetchCreateBus(payload);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Armada baru berhasil ditambahkan.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/mitra/bus');
            });

        } catch (error) {
            console.error('Error:', error);
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
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Tambah Armada Baru</h1>
                        <p className="text-slate-500 text-sm mt-1">Isi formulir di bawah untuk mendaftarkan bus</p>
                    </div>
                </div>

                <BusForm
                    initialData={{}}
                    onSubmit={handleCreateSubmit}
                    isLoading={isLoading}
                />
            </div>
        </StaffLayout>
    );
}