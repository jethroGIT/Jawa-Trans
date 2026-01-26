import StaffLayout from '../../../layouts/StaffLayout';
import tipebusService from '../../../services/mitra/tipebusService';
import authService from '../../../services/authService';
import TipeBusForm from '../../../components/staff/tipe-bus/TipeBusForm'; // Import Komponen Form
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateTipeBus() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [fasilitasOptions, setFasilitasOptions] = useState([]);
    const [isFetchingFasilitas, setIsFetchingFasilitas] = useState(true);

    useEffect(() => {
        const loadFasilitas = async () => {
            try {
                const response = await tipebusService.fetchFasilitas();
                if (response && Array.isArray(response)) {
                    setFasilitasOptions(response);
                } else if (response.success && Array.isArray(response.data)) {
                    setFasilitasOptions(response.data);
                }
            } catch (error) {
                console.error("Gagal memuat fasilitas:", error);
            } finally {
                setIsFetchingFasilitas(false);
            }
        };
        loadFasilitas();
    }, []);

    // 2. Handler Submit khusus untuk CREATE
    const handleCreateSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const user = authService.getUser();
            
            // Siapkan payload
            const payload = {
                tipe: formData.tipe,
                kapasitas: formData.kapasitas,
                fasilitas: formData.fasilitas,
                fotos: formData.fotos // Array File baru
            };

            await tipebusService.fetchCreateTipeBus(payload);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Tipe bus baru berhasil ditambahkan.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/mitra/tipe-bus');
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Gagal!',
                text: error.message || 'Terjadi kesalahan saat menyimpan data.',
                icon: 'error'
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
                        <h1 className="text-2xl font-bold text-slate-800">Tambah Tipe Bus Baru</h1>
                        <p className="text-slate-500 text-sm mt-1">Isi formulir di bawah untuk membuat tipe bus baru</p>
                    </div>
                </div>

                <TipeBusForm 
                    initialData={{}} 
                    onSubmit={handleCreateSubmit}
                    isLoading={isLoading}
                    fasilitasOptions={fasilitasOptions}
                    isFetchingFasilitas={isFetchingFasilitas}
                />
            </div>
        </StaffLayout>
    );
}