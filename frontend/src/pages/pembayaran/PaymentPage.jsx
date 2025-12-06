// components/payment/PaymentPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuestLayout from "../../layouts/GuestLayout";
import DetailPesananCard from "../../components/reservasi/DetailOrder";
import MetodePembayaranCard from "../../components/reservasi/MetodePembayaran";
import reservasiService from "../../services/reservasiService";

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Ambil data reservasi & metode pembayaran dari state navigasi
    const reservasiData = location.state?.reservasiData;

    const [metodePembayaran, setMetodePembayaran] = useState({
        virtualAccount: "",
        pembayaranInstan: ""
    });

    const [setujuSyarat, setSetujuSyarat] = useState(false);

    const payload = {
        idUser: reservasiData.idUser,
        idJadwal: reservasiData.idJadwal,

        penumpang: reservasiData.jumlahPenumpang,
        namaPenumpang: reservasiData.namaPenumpang,
        kursi: reservasiData.kursi,

        customer: {
            name: reservasiData.namaPemesan,
            email: reservasiData.emailPemesan,
            phone: reservasiData.teleponPemesan
        },

        method: metodePembayaran.virtualAccount !== ""
            ? metodePembayaran.virtualAccount
            : metodePembayaran.pembayaranInstan,

        totalHarga: reservasiData.totalHarga
    };


    const handleKonfirmasiPembayaran = async () => {
        if (!setujuSyarat) {
            alert("Anda harus menyetujui Syarat & Ketentuan");
            return;
        }

        if (!metodePembayaran.virtualAccount && !metodePembayaran.pembayaranInstan) {
            alert("Pilih metode pembayaran terlebih dahulu");
            return;
        }

        // Di sini nanti akan mengirim data ke backend
        console.log("Payload pembayaran:", payload);

        try {
            const response = await reservasiService.orderJadwal(payload);
            console.log("Response pembayaran:", response);

            if (response.success) {
                navigate("/transaction", { state: { paymentData: response } });
            } else {
                alert("Terjadi kesalahan saat memproses pembayaran: " + response.message);
            }
        } catch (error) {
            console.error("Error saat memproses pembayaran:", error);
        }
    };

    const handleBatal = () => {
        navigate(-1);
    };

    return (
        <GuestLayout>
            <div className="min-h-screen bg-blue-50 py-8 pt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Kolom Kiri - Detail Pesanan */}
                        <div className="space-y-6">
                            <DetailPesananCard
                                reservasiData={reservasiData}
                            />
                        </div>

                        {/* Kolom Kanan - Metode Pembayaran */}
                        <div className="space-y-6">
                            <MetodePembayaranCard
                                metodePembayaran={metodePembayaran}
                                onMetodeChange={setMetodePembayaran}
                                setujuSyarat={setujuSyarat}
                                onSetujuChange={setSetujuSyarat}
                                onKonfirmasi={handleKonfirmasiPembayaran}
                                onBatal={handleBatal}
                                totalHarga={reservasiData.totalHarga}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}