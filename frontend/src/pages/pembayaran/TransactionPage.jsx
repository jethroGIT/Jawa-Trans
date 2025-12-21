import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerLayout from '../../layouts/CustomerLayout';
import PembayaranBank from "../../components/reservasi/PembayaranBank";
import PembayaranInstan from "../../components/reservasi/PembayaranInstan";

export default function TransactionPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        if (location.state?.paymentData) {
            const data = location.state.paymentData;
            console.log("Data diterima:", data);
            setPaymentData(data);
        } else {
            console.log("Tidak ada paymentData, redirect atau handle error");
        }
    }, [location.state]);

    if (!paymentData) {
        return (
            <CustomerLayout>
                <div className="min-h-screen bg-blue-50 py-8 pt-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="ml-4 text-gray-600">Memuat data pembayaran...</p>
                        </div>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    const type = paymentData.payment?.payment_type;
    const isInstantPayment = type === "gopay" || type === "qris";

    return (
        <CustomerLayout>
            <div className="min-h-screen bg-blue-50 py-8 pt-20">
                <div className="max-w-2xl mx-auto px-4">
                    {isInstantPayment ? (
                        <PembayaranInstan paymentData={paymentData} />
                    ) : (
                        <PembayaranBank paymentData={paymentData} />
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}