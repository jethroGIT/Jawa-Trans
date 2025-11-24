// pages/JadwalPage.jsx
import GuestLayout from '../../layouts/GuestLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useJadwal } from '../../hooks/useJadwal';
import JadwalCard from '../../components/jadwal/JadwalCard';
import JadwalHeader from '../../components/jadwal/JadwalHeader';
import LoadingState from '../../components/jadwal/LoadingState';
import ErrorState from '../../components/jadwal/ErrorState';
import EmptyState from '../../components/jadwal/EmptyState';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function JadwalPage() {
    useDocumentTitle('Jadwal');
    const navigate = useNavigate();
    const { jadwal, loading, error } = useJadwal();
    const query = useQuery();

    const asal = query.get("from");
    const tujuan = query.get("to");
    const tanggal = query.get("date");
    const jumlahPenumpang = query.get("passengers");

    const handleChangeSearch = () => {
        navigate('/');
    };

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!jadwal || jadwal.length === 0) return <EmptyState />;

    return (
        <GuestLayout>
            <div className="min-h-screen bg-blue-50 py-8 pt-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with Route Info */}
                    <JadwalHeader
                        asal={asal}
                        tujuan={tujuan}
                        tanggal={tanggal}
                        jumlahPenumpang={jumlahPenumpang}
                        onChangeSearch={handleChangeSearch}
                    />

                    {/* Jadwal Cards - Vertical Stack */}
                    <div className="space-y-4">
                        {jadwal.map((item) => (
                            <JadwalCard key={item.idJadwal} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}