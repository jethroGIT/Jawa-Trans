import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuestLayout from "../../layouts/GuestLayout";
import TransaksiPembayaran from "../../components/reservasi/PembayaranBank";


export default function TransactionPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        if (location.state?.paymentData) {
            const data = location.state.paymentData;
            setPaymentData(data);
            console.log("PaymentData berhasil di-set");
        } else {
            console.log("Tidak ada paymentData di location.state");
        }
    }, [location.state]);


    if (!paymentData) {
        return (
            <GuestLayout>
                <div className="min-h-screen bg-blue-50 py-8 pt-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="ml-4 text-gray-600">Memuat data pembayaran...</p>
                        </div>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <div className="min-h-screen bg-blue-50 py-8 pt-20">
                <div className="max-w-2xl mx-auto px-4">
                    <TransaksiPembayaran paymentData={paymentData} />
                </div>
            </div>
        </GuestLayout>
    );
}