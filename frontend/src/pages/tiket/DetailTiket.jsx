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

    const reservasiData = {
        idJadwal: dataTiket.jadwal.idJadwal,
        mitra: dataTiket.jadwal.bus.mitra.nama,
        tlpMitra: dataTiket.jadwal.bus.mitra.telephone,
        emailMitra: dataTiket.jadwal.bus.mitra.email,
        terminalAsal: dataTiket.jadwal.terminalNaik.nama,
        terminalTujuan: dataTiket.jadwal.terminalTurun.nama,
        tanggal: new Date(dataTiket.jadwal.tanggal_keberangkatan).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        hari: new Date(dataTiket.jadwal.tanggal_keberangkatan).toLocaleDateString('id-ID', {
            weekday: 'long'
        }),
        jamKeberangkatan: new Date(dataTiket.jadwal.jam_keberangkatan).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        idUser: dataTiket.user.idUser,
        namaPemesan: dataTiket.user.nama,
        emailPemesan: dataTiket.user.email,
        teleponPemesan: dataTiket.user.telephone,
        penumpang: dataTiket.reservasi_detail.map(detail => ({
            nama: detail.namaPenumpang,
            kursi: detail.noKursi
        })),
        namaPenumpang: dataTiket.reservasi_detail.map(detail => detail.namaPenumpang),
        kursi: dataTiket.reservasi_detail.map(detail => detail.noKursi),
        hargaTiket: dataTiket.jadwal.harga,
        jumlahPenumpang: dataTiket.penumpang,
        totalHarga: dataTiket.jadwal.harga * dataTiket.penumpang
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