import SuperAdminLayout from '../../layouts/SuperAdminLayout';
import UserForm from '../../components/admin/user/UserForm';
import userMitraService from '../../services/admin/userMitraService';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UpdateAdminMitra() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [initialData, setInitialData] = useState({});

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const data = await userMitraService.getUserById(id);
                setInitialData(data);
            } catch (error) {
                Swal.fire('Gagal', error.message || 'Terjadi kesalahan', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const handleUpdate = async (formData) => {
        setIsSaving(true);
        try {
            await userMitraService.fetchUpdateUser(id, formData);
            Swal.fire('Berhasil', 'Admin Mitra berhasil diperbarui', 'success').then(() => navigate('/superadmin/admin-mitra'));
        } catch (error) {
            Swal.fire('Gagal', error.message || 'Terjadi kesalahan', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <SuperAdminLayout>
            <div className="h-64 flex items-center justify-center">Memuat...</div>
        </SuperAdminLayout>
    );

    return (
        <SuperAdminLayout>
            <div className="max-w-4xl mx-auto">
                <UserForm initialData={initialData} onSubmit={handleUpdate} isLoading={isSaving} />
            </div>
        </SuperAdminLayout>
    );
}
