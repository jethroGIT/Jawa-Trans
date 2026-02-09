import SuperAdminLayout from '../../layouts/SuperAdminLayout';
import UserForm from '../../components/admin/user/UserForm';
import userMitraService from '../../services/admin/userMitraService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateAdminMitra() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateSubmit = async (formData) => {
        setIsLoading(true);
        try {
            await userMitraService.fetchCreateUser(formData);
            Swal.fire('Berhasil', 'Admin Mitra berhasil dibuat', 'success').then(() => navigate('/superadmin/admin-mitra'));
        } catch (error) {
            Swal.fire('Gagal', error.message || 'Terjadi kesalahan', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SuperAdminLayout>
            <div className="max-w-4xl mx-auto">
                <UserForm initialData={{}} onSubmit={handleCreateSubmit} isLoading={isLoading} />
            </div>
        </SuperAdminLayout>
    );
}
