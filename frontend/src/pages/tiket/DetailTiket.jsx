import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import DetailOrder from "../../components/reservasi/DetailOrder";
import TiketActions from "../../components/tiket/TiketAction";
import tiketService from "../../services/tiketService";

export default function DetailTiket() {
    const { idReservasi } = useParams();

    // Note: useNavigate dihapus karena sudah dipindah ke TiketAction
    const [dataTiket, setDataTiket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tiket = await tiketService.fetchTiketById(idReservasi);
                setDataTiket(tiket);
            } catch (err) {
                setError("Gagal memuat data tiket");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idReservasi]);

    if (loading) {
        return (
            <CustomerLayout>
                <div className="min-h-screen bg-blue-50 flex items-center justify-center pt-20">
                    <p className="text-center text-lg">Loading...</p>
                </div>
            </CustomerLayout>
        );
    }

    if (error) {
        return (
            <CustomerLayout>
                <div className="min-h-screen bg-blue-50 flex items-center justify-center pt-20">
                    <p className="text-center text-red-500 text-lg">{error}</p>
                </div>
            </CustomerLayout>
        );
    }

    if (!dataTiket) {
        return (
            <CustomerLayout>
                <div className="min-h-screen bg-blue-50 flex items-center justify-center pt-20">
                    <p className="text-center text-lg">Tidak ada data.</p>
                </div>
            </CustomerLayout>
        );
    }

    // Extract jadwal dari reservasi_detail (struktur: reservasi_detail[0].jadwal)
    const jadwal = dataTiket.reservasi_detail?.[0]?.jadwal;
    
    if (!jadwal) {
        return (
            <CustomerLayout>
                <div className="min-h-screen bg-blue-50 flex items-center justify-center pt-20">
                    <p className="text-center text-lg">Data jadwal tidak ditemukan.</p>
                </div>
            </CustomerLayout>
        );
    }

    const reservasiData = {
        idJadwal: jadwal?.idJadwal || '-',
        mitra: jadwal?.bus?.jenis_kendaraan?.mitra?.nama || '-',
        tlpMitra: jadwal?.bus?.jenis_kendaraan?.mitra?.telephone || '-',
        emailMitra: jadwal?.bus?.jenis_kendaraan?.mitra?.email || '-',
        terminalAsal: jadwal?.terminalNaik?.nama || '-',
        terminalTujuan: jadwal?.terminalTurun?.nama || '-',
        tanggal: new Date(jadwal?.tanggal_keberangkatan).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        hari: new Date(jadwal?.tanggal_keberangkatan).toLocaleDateString('id-ID', {
            weekday: 'long'
        }),
        jamKeberangkatan: new Date(jadwal?.jam_keberangkatan).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        idUser: dataTiket.idUser || '-',
        namaPemesan: dataTiket.customer?.nama || '-',
        emailPemesan: dataTiket.customer?.email || '-',
        teleponPemesan: dataTiket.customer?.telephone || '-',
        penumpang: dataTiket.reservasi_detail.map(detail => ({
            nama: detail.namaPenumpang,
            kursi: String(detail.noKursi)
        })),
        namaPenumpang: dataTiket.reservasi_detail.map(detail => detail.namaPenumpang),
        kursi: dataTiket.reservasi_detail.map(detail => String(detail.noKursi)),
        hargaTiket: jadwal?.harga || 0,
        jumlahPenumpang: dataTiket.reservasi_detail.length,
        totalHarga: (jadwal?.harga || 0) * dataTiket.reservasi_detail.length
    };

    return (
        <CustomerLayout>
            <div className="min-h-screen bg-blue-50 py-8 pt-20">
                <div className="max-w-4xl mx-auto px-4">
                    {/* TiketActions kini menangani Back button & Print button */}
                    <TiketActions fileName={`Tiket-JawaTrans-${idReservasi}`}>
                        <DetailOrder reservasiData={reservasiData} />
                    </TiketActions>
                </div>
            </div>
        </CustomerLayout>
    );
}