import AdminLayout from '../../../layouts/AdminLayout';
import ProfileForm from '../../../components/admin/profile/ProfileForm';
import profileService from '../../../services/mitra/profileService';
import authService from '../../../services/authService';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';

export default function ProfileMitraAdmin() {
    const [profileData, setProfileData] = useState(null);
    const [mitraId, setMitraId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Data saat halaman dimuat
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = authService.getUser();
                if (!user || !user.idMitra) {
                    Swal.fire("Error", "Sesi kadaluarsa/ID tidak ditemukan.", "error");
                    return;
                }
                setMitraId(user.idMitra);

                const response = await profileService.fetchMitraData(user.idMitra);
                const data = response;
                console.log(data);

                // Set data untuk dilempar ke Form
                setProfileData({
                    nama: data.nama,
                    email: data.email,
                    telephone: data.telephone,
                    alamat: data.alamat,
                    logo: data.logoURL
                });

            } catch (error) {
                console.error("Gagal memuat profil:", error);
                Swal.fire("Gagal", "Tidak dapat mengambil data profil.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Handler Update
    const handleUpdateProfile = async (formDataPayload) => {
        setIsSaving(true);
        try {
            await profileService.fetchUpdateProfile(mitraId, formDataPayload);

            Swal.fire('Berhasil!', 'Profil mitra telah diperbarui.', 'success');

            return true;
        } catch (error) {
            console.error("Gagal update profil:", error);
            Swal.fire('Gagal!', error.message || 'Terjadi kesalahan.', 'error');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-screen flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p>Memuat profil mitra...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ProfileForm
                initialData={profileData}
                onSubmit={handleUpdateProfile}
                isSaving={isSaving}
            />
        </AdminLayout>
    );
}
