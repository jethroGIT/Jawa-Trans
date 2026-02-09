import StaffLayout from '../../../layouts/StaffLayout';
import tipebusService from '../../../services/mitra/tipebusService';
import TipeBusForm from '../../../components/staff/tipe-bus/TipeBusForm';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditTipeBus() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [initialData, setInitialData] = useState({});
    const [fasilitasOptions, setFasilitasOptions] = useState([]);
    const [isFetchingFasilitas, setIsFetchingFasilitas] = useState(true);

    // Load jenis kendaraan data dan fasilitas pada mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsFetchingData(true);
                setIsFetchingFasilitas(true);

                // Fetch jenis kendaraan data by ID
                const tipeBusData = await tipebusService.fetchTipeBusById(id);
                console.log("Fetched jenis kendaraan data:", tipeBusData);

                // Transform data untuk form
                const transformedData = {
                    tipe: tipeBusData?.tipe || '',
                    kapasitas: tipeBusData?.kapasitas || '',
                    fasilitas: tipeBusData?.fasilitas && Array.isArray(tipeBusData.fasilitas)
                        ? tipeBusData.fasilitas.map(f => f.idFasilitas)
                        : [],
                    existingPhotos: tipeBusData?.foto_bus && Array.isArray(tipeBusData.foto_bus)
                        ? tipeBusData.foto_bus.map(f => f.url || f.nama)
                        : []
                };
                setInitialData(transformedData);

                // Fetch fasilitas options
                const fasilitasData = await tipebusService.fetchFasilitas();
                setFasilitasOptions(fasilitasData || []);
            } catch (error) {
                console.error("Gagal memuat data:", error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'Gagal memuat data jenis kendaraan',
                    icon: 'error',
                    confirmButtonColor: '#2563EB'
                }).then(() => {
                    navigate('/mitra/jenis-kendaraan');
                });
            } finally {
                setIsFetchingData(false);
                setIsFetchingFasilitas(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id, navigate]);

    // Handler Submit untuk UPDATE
    const handleUpdateSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const payload = {
                tipe: formData.tipe,
                kapasitas: formData.kapasitas,
                fasilitas: formData.fasilitas || [],
                fotos: formData.fotos || [], // File baru
                existingPhotos: formData.existingPhotos || [] // Foto lama yg dipertahankan
            };

            console.log("Submitting update with payload:", payload);
            await tipebusService.fetchUpdateTipeBus(id, payload);

            Swal.fire({
                title: 'Berhasil!',
                text: 'Jenis kendaraan berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            }).then(() => {
                navigate('/mitra/jenis-kendaraan');
            });

        } catch (error) {
            console.error("Error updating jenis kendaraan:", error);
            Swal.fire({
                title: 'Gagal!',
                text: error.message || 'Terjadi kesalahan saat menyimpan data.',
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingData) {
        return (
            <StaffLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin inline-flex items-center justify-center w-10 h-10 text-blue-600 mb-4">
                            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <p className="text-slate-600">Memuat data jenis kendaraan...</p>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Edit Jenis Kendaraan</h1>
                        <p className="text-slate-500 text-sm mt-1">Ubah informasi jenis kendaraan di bawah</p>
                    </div>
                </div>

                <TipeBusForm
                    initialData={initialData}
                    onSubmit={handleUpdateSubmit}
                    isLoading={isLoading}
                    fasilitasOptions={fasilitasOptions}
                    isFetchingFasilitas={isFetchingFasilitas}
                />
            </div>
        </StaffLayout>
    );
}