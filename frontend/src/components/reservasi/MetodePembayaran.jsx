
// components/payment/MetodePembayaranCard.jsx
import { useState } from "react";
import bca from "../../assets/Pembayaran/bca.png";
import bri from "../../assets/Pembayaran/bri.png";
import bni from "../../assets/Pembayaran/bni.png";
import mandiri from "../../assets/Pembayaran/mandiri.png";
import gopay from "../../assets/Pembayaran/gopay.png";
import qris from "../../assets/Pembayaran/oripay.png";

export default function MetodePembayaranCard({
    metodePembayaran,
    onMetodeChange,
    setujuSyarat,
    onSetujuChange,
    onKonfirmasi,
    onBatal,
    totalHarga
}) {
    // Data metode pembayaran dengan logo
    const metodeVA = [
        { id: "bca", nama: "Bank BCA VA", kode: "bca", logo: bca },
        { id: "bni", nama: "Bank BNI VA", kode: "bni", logo: bni },
        { id: "bri", nama: "Bank BRI VA", kode: "bri", logo: bri },
        { id: "mandiri", nama: "Bank Mandiri VA", kode: "mandiri", logo: mandiri }
    ];

    const metodeInstan = [
        { id: "gopay", nama: "GOPAY", kode: "gopay", logo: gopay },
        { id: "qris", nama: "QRIS", kode: "qris", logo: qris }
    ];

    const handlePilihVA = (bankId) => {
        onMetodeChange({
            virtualAccount: bankId,
            pembayaranInstan: ""
        });
    };

    const handlePilihInstan = (methodId) => {
        onMetodeChange({
            virtualAccount: "",
            pembayaranInstan: methodId
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                    Pilih Metode Pembayaran
                </h2>
            </div>

            {/* Virtual Account */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                    Virtual Account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {metodeVA.map((bank) => (
                        <div
                            key={bank.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${metodePembayaran.virtualAccount === bank.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            onClick={() => handlePilihVA(bank.id)}
                        >
                            <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${metodePembayaran.virtualAccount === bank.id
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }`}>
                                    {metodePembayaran.virtualAccount === bank.id && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex items-center h-8">
                                    <img
                                        src={bank.logo}
                                        alt={bank.nama}
                                        className="h-8 max-w-[120px] object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pembayaran Instan */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                    Pembayaran Instan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                    {metodeInstan.map((method) => (
                        <div
                            key={method.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${metodePembayaran.pembayaranInstan === method.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            onClick={() => handlePilihInstan(method.id)}
                        >
                            <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${metodePembayaran.pembayaranInstan === method.id
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }`}>
                                    {metodePembayaran.pembayaranInstan === method.id && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex items-center h-8">
                                    <img
                                        src={method.logo}
                                        alt={method.nama}
                                        className="h-8 max-w-[120px] object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Syarat dan Ketentuan */}
            <div className="mb-6">
                <label className="flex items-start">
                    <input
                        type="checkbox"
                        checked={setujuSyarat}
                        onChange={(e) => onSetujuChange(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        Saya telah membaca dan menyetujui{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Syarat & Ketentuan
                        </a>
                    </span>
                </label>
            </div>

            {/* Tombol Action */}
            <div className="flex gap-4">
                <button
                    onClick={onBatal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                    Batal
                </button>

                <button
                    onClick={onKonfirmasi}
                    disabled={!setujuSyarat || (!metodePembayaran.virtualAccount && !metodePembayaran.pembayaranInstan)}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${setujuSyarat && (metodePembayaran.virtualAccount || metodePembayaran.pembayaranInstan)
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Konfirmasi Pembayaran
                </button>
            </div>
        </div>
    );
}