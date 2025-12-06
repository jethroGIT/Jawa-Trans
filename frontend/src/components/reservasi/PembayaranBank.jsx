import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';
import bca from "../../assets/Pembayaran/bca.png";
import bri from "../../assets/Pembayaran/bri.png";
import bni from "../../assets/Pembayaran/bni.png";
import mandiri from "../../assets/Pembayaran/mandiri.png";
import { io } from "socket.io-client";

export default function TransaksiPembayaran({ paymentData }) {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [expandedSection, setExpandedSection] = useState(null);
    const [isPaymentChecking, setIsPaymentChecking] = useState(false);

    useEffect(() => {
        if (!paymentData?.payment?.expiry_time) return;

        const calculateTimeLeft = () => {
            const expiryTimeStr = paymentData.payment.expiry_time.replace(' ', 'T') + '+07:00';
            const expiryTime = new Date(expiryTimeStr).getTime();
            const now = new Date().getTime();
            const difference = expiryTime - now;

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ hours, minutes, seconds });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [paymentData]);

    // Polling untuk mengecek status pembayaran
    useEffect(() => {
        if (!paymentData?.payment?.order_id) return;

        const socket = io("http://localhost:8000");

        const eventName = `payment_status_${paymentData.payment.order_id}`;

        socket.on(eventName, (data) => {
            console.log("Realtime payment update:", data);

            if (data.status === "settlement") {
                Swal.fire({
                    icon: "success",
                    title: "Pembayaran Berhasil!",
                    text: "Terima kasih, pembayaran Anda telah dikonfirmasi.",
                    allowOutsideClick: false
                }).then(() => {
                    navigate("/list-tiket");
                });;
            }
        });

        return () => {
            socket.off(eventName);
            socket.disconnect();
        };
    }, [paymentData]);


    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Nomor rekening berhasil disalin!',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    };

    const formatExpiryTime = (expiryTime) => {
        const date = new Date(expiryTime);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        const dayName = days[date.getDay()];
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${dayName}, ${day} ${month} ${year}, ${hours}:${minutes} WIB`;
    };

    const formatCurrency = (amount) => {
        const formatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
        return formatted;
    };

    const vaNumber = paymentData?.payment?.va_numbers?.[0]?.va_number || '';
    const bank = paymentData?.payment?.va_numbers?.[0]?.bank?.toUpperCase() || '';
    const amount = paymentData?.payment?.gross_amount || '0';

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const formatVANumber = (number) => {
        return number.replace(/(.{4})/g, '$1 ').trim();
    };

    const handleLihatTiket = () => {
        navigate('/daftar-tiket');
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header with Countdown */}
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800">Selesaikan Sebelum</h2>

                    <div className="flex gap-1.5 items-center">
                        <div className="bg-red-500 rounded px-2.5 py-1.5 min-w-[45px] text-center">
                            <span className="text-white font-bold text-lg">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-gray-700 font-bold text-lg">:</span>
                        <div className="bg-red-500 rounded px-2.5 py-1.5 min-w-[45px] text-center">
                            <span className="text-white font-bold text-lg">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-gray-700 font-bold text-lg">:</span>
                        <div className="bg-red-500 rounded px-2.5 py-1.5 min-w-[45px] text-center">
                            <span className="text-white font-bold text-lg">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-0.5 bg-gray-400 w-full mt-2"></div>
            </div>

            {/* Instruksi Pembayaran */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Instruksi Pembayaran</h2>

                    <div className="bg-blue-50 rounded p-3 border border-gray-300 min-w-[250px]">
                        <div className="text-sm text-gray-600 font-semibold">Selesaikan Sebelum</div>
                        <div className="text-sm text-gray-800 font-medium">
                            {formatExpiryTime(paymentData?.payment?.expiry_time)}
                        </div>
                    </div>
                </div>

                {/* Bank Selection */}
                <div className="mb-4">
                    <label className="text-base font-bold text-gray-800 mb-3 block">
                        Lakukan Transfer ke
                    </label>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-white rounded border border-gray-200 flex items-center justify-center p-2">
                            {bank === 'BCA' && <img src={bca} alt="BCA" className="w-full h-full object-contain" />}
                            {bank === 'BNI' && <img src={bni} alt="BNI" className="w-full h-full object-contain" />}
                            {bank === 'BRI' && <img src={bri} alt="BRI" className="w-full h-full object-contain" />}
                            {bank === 'MANDIRI' && <img src={mandiri} alt="Mandiri" className="w-full h-full object-contain" />}
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-800">Bank {bank}</div>
                            <div className="text-sm text-gray-600">Bank Virtual Account</div>
                        </div>
                    </div>
                </div>

                {/* VA Number */}
                <div className="mb-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                        <span className="font-bold text-base text-gray-800 tracking-wide">
                            {formatVANumber(vaNumber)}
                        </span>
                        <button
                            onClick={() => copyToClipboard(vaNumber)}
                            className="text-blue-600 hover:text-gray-800 bg-blue-300 p-1.5 rounded flex-shrink-0"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                </div>

                {/* Total Pembayaran */}
                <div className="mb-6">
                    <label className="text-base font-bold text-gray-800 mb-2 block">
                        Total Pembayaran
                    </label>
                    <div className="p-3 bg-blue-50 rounded">
                        <span className="font-bold text-base text-gray-800 tracking-wide">
                            {formatCurrency(amount)}
                        </span>
                    </div>
                </div>

                {/* Cara Membayar */}
                <div>
                    <h4 className="text-base font-bold text-gray-800 mb-3">Cara Membayar</h4>

                    {/* ATM */}
                    <div className="bg-gray-100 border-2 border-gray-300 rounded mb-1 overflow-hidden">
                        <button
                            onClick={() => toggleSection('atm')}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-white"
                        >
                            <span className="text-base font-bold text-gray-800">Transfer Melalui ATM</span>
                            {expandedSection === 'atm' ? (
                                <ChevronUp className="text-gray-500 flex-shrink-0" size={20} />
                            ) : (
                                <ChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                            )}
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out ${expandedSection === 'atm' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-3 pb-3 text-sm text-gray-700 space-y-1">
                                <p>1. Masukkan kartu ATM dan PIN Anda</p>
                                <p>2. Pilih menu Transfer</p>
                                <p>3. Pilih ke Rekening {bank}</p>
                                <p>4. Masukkan nomor Virtual Account</p>
                                <p>5. Masukkan jumlah yang akan dibayar</p>
                                <p>6. Konfirmasi dan selesaikan transaksi</p>
                            </div>
                        </div>
                    </div>

                    {/* Internet Banking */}
                    <div className="bg-gray-100 border-2 border-gray-300 rounded mb-1 overflow-hidden">
                        <button
                            onClick={() => toggleSection('ibanking')}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-white"
                        >
                            <span className="text-base font-bold text-gray-800">Transfer Melalui Internet Banking</span>
                            {expandedSection === 'ibanking' ? (
                                <ChevronUp className="text-gray-500 flex-shrink-0" size={20} />
                            ) : (
                                <ChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                            )}
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out ${expandedSection === 'ibanking' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-3 pb-3 text-sm text-gray-700 space-y-1">
                                <p>1. Login ke Internet Banking Anda</p>
                                <p>2. Pilih menu Transfer</p>
                                <p>3. Pilih transfer ke {bank}</p>
                                <p>4. Masukkan nomor Virtual Account</p>
                                <p>5. Masukkan jumlah transfer</p>
                                <p>6. Konfirmasi dan selesaikan transaksi</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Banking */}
                    <div className="bg-gray-100 border-2 border-gray-300 rounded mb-1 overflow-hidden">
                        <button
                            onClick={() => toggleSection('mbanking')}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-white"
                        >
                            <span className="text-base font-bold text-gray-800">Transfer Melalui Mobile Banking</span>
                            {expandedSection === 'mbanking' ? (
                                <ChevronUp className="text-gray-500 flex-shrink-0" size={20} />
                            ) : (
                                <ChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                            )}
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out ${expandedSection === 'mbanking' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-3 pb-3 text-sm text-gray-700 space-y-1">
                                <p>1. Buka aplikasi Mobile Banking</p>
                                <p>2. Pilih menu Transfer</p>
                                <p>3. Pilih transfer ke {bank}</p>
                                <p>4. Masukkan nomor Virtual Account</p>
                                <p>5. Masukkan jumlah transfer</p>
                                <p>6. Konfirmasi dan selesaikan transaksi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lihat Tiket Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleLihatTiket}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-2.5 rounded-lg transition-colors shadow-md"
                >
                    Lihat Tiket
                </button>
            </div>
        </div>
    );
}
