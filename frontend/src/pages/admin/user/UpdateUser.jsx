import AdminLayout from '../../../layouts/AdminLayout';
import userMitraService from '../../../services/admin/userMitraService';
import UserForm from '../../../components/admin/user/UserForm';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UpdateUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setIsFetching(true);
                const data = await userMitraService.getUserById(id);
                // Ensure data matches what UserForm expects
                setInitialData({
                    idEmployee: data.idEmployee,
                    nama: data.nama,
                    nik: data.nik,
                    email: data.email,
                    telephone: data.telephone,
                    alamat: data.alamat,
                    idRole: data.idRole,
                    idMitra: data.idMitra
                });
            } catch (error) {
                console.error('Error loading user:', error);
                Swal.fire('Error', 'Gagal memuat data user.', 'error').then(() => {
                    navigate('/admin/user-mitra');
                });
            } finally {
                setIsFetching(false);
            }
        };

        if (id) {
            loadUser();
        }
    }, [id, navigate]);

    // Handler Submit untuk UPDATE
    const handleUpdateSubmit = async (formData) => {
        setIsLoading(true);

        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang memperbarui data user',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await userMitraService.fetchUpdateUser(id, formData);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Data user berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/admin/user-mitra');
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
                    <p className="text-slate-500">Memuat data user...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Edit User</h1>
                        <p className="text-slate-500 text-sm mt-1">Perbarui informasi user di bawah ini</p>
                    </div>
                </div>

                <UserForm
                    initialData={initialData}
                    onSubmit={handleUpdateSubmit}
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
}
