import GuestLayout from "../../layouts/GuestLayout";
import TiketReservasi from "../../components/tiket/TiketReservasi";


export default function TiketPage() {
    return (
        <GuestLayout>
            <div className="min-h-screen bg-blue-50 py-8 pt-20">
                <div className="max-w-7xl mx-auto px-4">
                    <TiketReservasi />
                </div>
            </div>
        </GuestLayout>
    );
}