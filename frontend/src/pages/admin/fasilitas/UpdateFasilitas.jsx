import AdminLayout from '../../../layouts/AdminLayout';
import fasilitasService from '../../../services/admin/fasilitasService';
import FasilitasForm from '../../../components/admin/fasilitas/FasilitasForm';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UpdateFasilitas() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const loadFasilitas = async () => {
            try {
                setIsFetching(true);
                const data = await fasilitasService.getFasilitasById(id);
                setInitialData({
                    idFasilitas: data.idFasilitas,
                    nama: data.nama
                });
            } catch (error) {
                console.error('Error loading fasilitas:', error);
                Swal.fire('Error', 'Gagal memuat data fasilitas.', 'error').then(() => {
                    navigate('/admin/fasilitas');
                });
            } finally {
                setIsFetching(false);
            }
        };

        if (id) {
            loadFasilitas();
        }
    }, [id, navigate]);

    // Handler Submit untuk UPDATE
    const handleUpdateSubmit = async (formData) => {
        setIsLoading(true);

        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang memperbarui data fasilitas',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await fasilitasService.fetchUpdateFasilitas(id, formData);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Data fasilitas berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/admin/fasilitas');
            });

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Gagal!',
                text: error.message || 'Terjadi kesalahan saat menyimpan perubahan.',
                icon: 'error',
                confirmButtonColor: '#DC2626'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <p className="text-slate-500">Memuat data fasilitas...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Edit Fasilitas</h1>
                        <p className="text-slate-500 text-sm mt-1">Perbarui informasi fasilitas di bawah ini</p>
                    </div>
                </div>

                <FasilitasForm
                    initialData={initialData}
                    onSubmit={handleUpdateSubmit}
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
}