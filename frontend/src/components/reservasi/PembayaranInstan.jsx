import { useState, useEffect, useRef } from 'react'; // Tambahkan useRef
import { useNavigate } from 'react-router-dom';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';
import gopay from "../../assets/Pembayaran/gopay.png";
import oripay from "../../assets/Pembayaran/oripay.png";
import { io } from "socket.io-client";

export default function PembayaranInstan({ paymentData }) {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [expandedSection, setExpandedSection] = useState(null);

    const hasExpired = useRef(false); // Ref untuk mencegah double trigger expire

    const handlePaymentExpired = () => {
        if (hasExpired.current) return; // Cegah eksekusi berulang
        hasExpired.current = true;

        Swal.fire({
            icon: "error",
            title: "Waktu Pembayaran Habis",
            text: "Batas waktu pembayaran telah berakhir. Silahkan melakukan pemesanan ulang.",
            allowOutsideClick: false,
            confirmButtonText: "Kembali ke Jadwal",
            confirmButtonColor: "#3085d6",
        }).then(() => {
            navigate("/jadwal"); 
        });
    };

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
                clearInterval(timer); // Hentikan timer
                handlePaymentExpired(); // Panggil fungsi expire segera!
            }
        };

        // Jalankan sekali saat mount agar tidak menunggu 1 detik pertama
        calculateTimeLeft();

        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [paymentData]);

    useEffect(() => {
        if (!paymentData?.payment?.order_id) return;

        const socket = io("http://localhost:8000");
        const eventName = `payment_status_${paymentData.payment.order_id}`;

        socket.on(eventName, (data) => {
            console.log("Realtime payment update:", data);

            if (data.status === "settlement") {
                hasExpired.current = true; // Set flag agar timer tidak menimpa sukses
                Swal.fire({
                    icon: "success",
                    title: "Pembayaran Berhasil!",
                    text: "Terima kasih, pembayaran Anda telah dikonfirmasi.",
                    allowOutsideClick: false
                }).then(() => {
                    navigate("/list-tiket");
                });
            }
            // Jika expire dari socket datang (mungkin timer frontend meleset dikit), tetap tangani
            else if (data.status === "expire") {
                handlePaymentExpired();
            }
        });

        return () => {
            socket.off(eventName);
            socket.disconnect();
        };
    }, [paymentData]);

    const formatExpiryTime = (expiryTime) => {
        if (!expiryTime) return "";
        const date = new Date(expiryTime.replace(' ', 'T'));
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
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const qrURL = paymentData?.payment?.actions?.[0]?.url || '';
    const eWallet = paymentData?.payment?.payment_type?.toUpperCase() || '';
    const amount = paymentData?.payment?.gross_amount || '0';

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header with Countdown */}
            <div>
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
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Instruksi Pembayaran</h2>

                    <div className="bg-blue-50 rounded p-3 border border-gray-300 min-w-[250px]">
                        <div className="text-sm text-gray-600 font-semibold">Selesaikan Sebelum</div>
                        <div className="text-sm text-gray-800 font-medium">
                            {formatExpiryTime(paymentData?.payment?.expiry_time)}
                        </div>
                    </div>
                </div>

                {/* E-Wallet Selection */}
                <div className="mb-4">
                    <label className="text-base font-bold text-gray-800 mb-3 block">
                        Scan Barcode Pembayaran
                    </label>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-white rounded border border-gray-200 flex items-center justify-center p-2">
                            {eWallet === 'GOPAY' && <img src={gopay} alt="GOPAY" className="w-full h-full object-contain" />}
                            {eWallet === 'QRIS' && <img src={oripay} alt="QRIS" className="w-full h-full object-contain" />}
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-800">{eWallet}</div>
                            <div className="text-sm text-gray-600">Metode Pembayaran Instan</div>
                        </div>
                    </div>
                </div>

                <div className="flex my-6">
                    <img
                        src={qrURL}
                        alt="Barcode QR"
                        className="w-56 h-auto mx-auto border border-gray-200 rounded p-2 shadow-sm"
                    />
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

                    {/* Accordion: Cara Scan QR */}
                    <div className="bg-gray-100 border-2 border-gray-300 rounded overflow-hidden">
                        <button
                            onClick={() => toggleSection('scan_qr')}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-white transition-colors"
                        >
                            <span className="text-base font-bold text-gray-800">
                                Cara Pembayaran {eWallet === 'QRIS' ? 'Via Scan QRIS' : 'Via Aplikasi Gojek'}
                            </span>
                            {expandedSection === 'scan_qr' ? (
                                <ChevronUp className="text-gray-500 flex-shrink-0" size={20} />
                            ) : (
                                <ChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                            )}
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out ${expandedSection === 'scan_qr' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-4 pb-4 pt-1 text-sm text-gray-700 space-y-2">
                                <div className="flex gap-2">
                                    <span className="font-bold min-w-[15px]">1.</span>
                                    <p>
                                        Buka aplikasi
                                        {eWallet === 'GOPAY'
                                            ? ' Gojek '
                                            : ' E-Wallet (OVO, Dana, Oripay) atau Mobile Banking '}
                                        Anda.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold min-w-[15px]">2.</span>
                                    <p>Tekan menu <strong>Bayar</strong> atau <strong>Scan</strong>.</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold min-w-[15px]">3.</span>
                                    <p>Arahkan kamera HP Anda ke <strong>QR Code</strong> yang tertera di atas.</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold min-w-[15px]">4.</span>
                                    <p>Periksa detail pembayaran (Nama Merchant & Total Tagihan).</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold min-w-[15px]">5.</span>
                                    <p>Masukkan PIN Anda untuk menyelesaikan transaksi.</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold min-w-[15px]">6.</span>
                                    <p>Transaksi selesai! Status pembayaran akan otomatis diperbarui.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}