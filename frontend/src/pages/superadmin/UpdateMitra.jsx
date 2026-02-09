import SuperAdminLayout from '../../layouts/SuperAdminLayout';
import MitraForm from '../../components/superadmin/mitra/MitraForm';
import mitraService from '../../services/admin/mitraService';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateMitra() {
    const { id } = useParams();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const data = await mitraService.getMitraById(id);
                setInitialData(data);
            } catch (error) {
                Swal.fire('Gagal', error.message || 'Tidak dapat memuat data', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const handleUpdate = async (formData) => {
        setIsSaving(true);
        try {
            await mitraService.updateMitra(id, formData);
            Swal.fire('Berhasil', 'Mitra berhasil diperbarui', 'success').then(() => navigate('/superadmin/mitra'));
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
                <MitraForm initialData={initialData} onSubmit={handleUpdate} isSaving={isSaving} />
            </div>
        </SuperAdminLayout>
    );
}
