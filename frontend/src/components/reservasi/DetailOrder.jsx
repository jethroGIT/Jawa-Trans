import { User, Phone, Mail, Bus } from 'lucide-react';
import logo2 from '../../assets/CL/banner.png';

export default function DetailOrder({ reservasiData }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header dengan Logo */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Detail Pesanan
                </h1>
                <img src={logo2} alt="Logo Jawa Trans" className="h-12 object-contain" />
            </div>

            {/* Garis Pemisah */}
            <div className="border-t border-dashed border-gray-300 my-3 "></div>

            {/* Informasi Terminal - Grid Layout */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Terminal Asal */}
                <div>
                    <h2 className="font-bold text-gray-900 text-base mb-1">
                        {reservasiData.terminalAsal}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {reservasiData.hari}, {reservasiData.tanggal}
                    </p>
                </div>

                {/* Terminal Tujuan */}
                <div className="text-right">
                    <h2 className="font-bold text-gray-900 text-base mb-1">
                        {reservasiData.terminalTujuan || 'Nama Terminal Tujuan'}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {reservasiData.jamKeberangkatan || 'Jam Keberangkatan'} WIB
                    </p>
                </div>
            </div>

            {/* Garis Pemisah */}
            <div className="border-t border-dashed border-gray-300 my-3"></div>

            {/* Data Pemesan */}
            <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-1 text-base">
                    Data Pemesan
                </h3>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{reservasiData.namaPemesan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{reservasiData.teleponPemesan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{reservasiData.emailPemesan}</span>
                    </div>
                </div>
            </div>

            {/* Tabel Penumpang */}
            <div className="mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                    No.
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                    Nama Penumpang
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                    Kursi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {reservasiData.penumpang.map((penumpang, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                        {penumpang.nama}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                        {penumpang.kursi}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Garis Pemisah Putus-putus */}
            <div className="border-t border-dashed border-gray-300 my-3"></div>

            {/* Rincian Harga dengan Garis Putus-putus */}
            <div className="space-y-1">
                {/* Harga Tiket */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Harga tiket</span>
                    <span className="font-semibold text-gray-900">
                        Rp. {reservasiData.hargaTiket.toLocaleString('id-ID')}
                    </span>
                </div>

                {/* Jumlah Penumpang */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Jumlah penumpang</span>
                    <span className="font-semibold text-gray-900">
                        x {reservasiData.jumlahPenumpang}
                    </span>
                </div>

                <div className="border-t border-dashed border-gray-300 my-2"></div>

                {/* Garis Putus-putus sebelum Total */}
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Harga</span>
                    <span className="text-lg font-bold text-red-400">
                        Rp. {reservasiData.totalHarga.toLocaleString('id-ID')}
                    </span>
                </div>
            </div>
        </div>
    );
}