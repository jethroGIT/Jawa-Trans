import SuperAdminLayout from '../../layouts/SuperAdminLayout';
import MitraForm from '../../components/superadmin/mitra/MitraForm';
import mitraService from '../../services/admin/mitraService';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function CreateMitra() {
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (formData) => {
        setIsSaving(true);
        try {
            await mitraService.createMitra(formData);
            Swal.fire('Berhasil', 'Mitra berhasil dibuat', 'success').then(() => navigate('/superadmin/mitra'));
        } catch (error) {
            Swal.fire('Gagal', error.message || 'Terjadi kesalahan', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SuperAdminLayout>
            <div className="max-w-4xl mx-auto">
                <MitraForm initialData={{}} onSubmit={handleCreate} isSaving={isSaving} />
            </div>
        </SuperAdminLayout>
    );
}
