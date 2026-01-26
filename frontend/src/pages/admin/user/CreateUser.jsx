import AdminLayout from '../../../layouts/AdminLayout';
import userMitraService from '../../../services/admin/userMitraService';
import UserForm from '../../../components/admin/user/UserForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateUser() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Handler Submit untuk CREATE
    const handleCreateSubmit = async (formData) => {
        setIsLoading(true);

        // Tampilkan loading alert
        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sedang menyimpan data user',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const result = await userMitraService.fetchCreateUser(formData);

            Swal.fire({
                title: 'Berhasil!',
                text: 'User baru berhasil ditambahkan.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/admin/user-mitra');
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
                        <h1 className="text-2xl font-bold text-slate-800">Tambah User Baru</h1>
                        <p className="text-slate-500 text-sm mt-1">Isi formulir di bawah untuk mendaftarkan user baru</p>
                    </div>
                </div>

                <UserForm
                    initialData={{}}
                    onSubmit={handleCreateSubmit}
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
}
