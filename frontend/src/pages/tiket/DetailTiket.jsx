import GuestLayout from "../../layouts/GuestLayout";
import DetailOrder from "../../components/reservasi/DetailOrder";


export default function TiketPage() {
    const reservasiData = {
        // Data Jadwal
        idJadwal: 123,
        terminalAsal: "Terminal Leuwi Panjang",
        terminalTujuan: "Terminal Bungurasih",
        tanggal: "15 Agustus 2025",
        hari: "Jumat",
        jamKeberangkatan: "07.30",

        // Data Pemesan
        idUser: 45,
        namaPemesan: "Jethro Andersson",
        emailPemesan: "jethro@example.com",
        teleponPemesan: "081234567890",

        // Data Penumpang
        penumpang: [
            { nama: "Budi Setiawan", kursi: "A1" },
            { nama: "Tono Wijaya", kursi: "A2" }
        ],
        namaPenumpang: ["Budi Setiawan", "Tono Wijaya"],
        kursi: ["A1", "A2"],

        // Data Harga
        hargaTiket: 150000,
        jumlahPenumpang: 2,
        totalHarga: 300000
    };

    return (
        <GuestLayout>
            <div className="min-h-screen bg-blue-50 py-8 pt-20">
                <div className="max-w-4xl mx-auto px-4">
                    <DetailOrder reservasiData={reservasiData}/>
                </div>
            </div>
        </GuestLayout>
    );
}