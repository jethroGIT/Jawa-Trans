// pages/DetailJadwalPage.jsx
import { useLocation } from "react-router-dom";
import { useJadwal } from "../../hooks/useJadwal";
import GuestLayout from "../../layouts/GuestLayout";
import LoadingState from '../../components/jadwal/LoadingState';
import ErrorState from '../../components/jadwal/ErrorState';
import EmptyState from '../../components/jadwal/EmptyState';
import FotoCard from "../../components/detail-jadwal/FotoCard";
import MobilCard from "../../components/detail-jadwal/MobilCard";
import OrderCard from "../../components/detail-jadwal/OrderCard";
import RuteCard from "../../components/detail-jadwal/RuteCard";

export default function DetailJadwalPage() {
    const query = new URLSearchParams(useLocation().search);
    const idJadwal = query.get("idJadwal");
    const jumlahPenumpang = query.get("jumlahPenumpang");

    const { jadwal, loading, error } = useJadwal(idJadwal);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!jadwal) return <EmptyState />;

    return (
        <GuestLayout>
            <div className="min-h-screen bg-blue-50 py-8 pt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <FotoCard jadwal={jadwal} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <MobilCard jadwal={jadwal} />
                            <RuteCard jadwal={jadwal} />
                        </div>

                        <div className="lg:col-span-2">
                            <OrderCard jadwal={jadwal} jumlahPenumpang={jumlahPenumpang} />
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}