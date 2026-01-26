import AdminLayout from '../../../layouts/AdminLayout';
import fasilitasService from '../../../services/admin/fasilitasService';
import FasilitasForm from '../../../components/admin/fasilitas/FasilitasForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateFasilitas() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Handler Submit untuk CREATE
    const handleCreateSubmit = async (formData) => {
        setIsLoading(true);

        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang menyimpan data fasilitas',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await fasilitasService.fetchCreateFasilitas(formData);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Fasilitas baru berhasil ditambahkan.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/admin/fasilitas');
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
        <AdminLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Tambah Fasilitas Baru</h1>
                        <p className="text-slate-500 text-sm mt-1">Isi formulir di bawah untuk mendaftarkan fasilitas baru</p>
                    </div>
                </div>

                <FasilitasForm
                    initialData={{}}
                    onSubmit={handleCreateSubmit}
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
}
