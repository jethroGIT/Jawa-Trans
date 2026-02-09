import React, { useState, useEffect } from 'react';
import {
    Bus,
    MapPin,
    Calendar,
    Clock,
    CreditCard,
    CheckCircle,
    AlertCircle,
    XCircle,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import KeuanganLayout from '../../../layouts/KeuanganLayout';
import reservasiService from '../../../services/keuangan/reservasiService';
import Swal from 'sweetalert2';

// StatCard Medium: Padding p-4, Ikon size 20, Text-sm/lg
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-2.5 rounded-lg bg-${color}-50 flex-shrink-0`}>
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider leading-tight">
                {title}
            </p>
            <h2 className="text-lg font-bold text-gray-800">
                {value}
            </h2>
        </div>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
        <span className="text-gray-500 text-base">{label}</span>
        <span className="font-semibold text-gray-800 text-base">{value}</span>
    </div>
);

const DetailPendapatanJadwal = () => {
    const navigate = useNavigate();
    const { idJadwal } = useParams();

    // State management
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter state
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterMetode, setFilterMetode] = useState('all');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    const getFilteredReservasi = () => {
        if (!data) return [];
        
        return data.reservasi.filter(res => {
            const statusMatch = filterStatus === 'all' || res.status === filterStatus;
            const metodeMatch = filterMetode === 'all' || res.metode === filterMetode;
            return statusMatch && metodeMatch;
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':');
        } catch (e) {
            return '-';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!idJadwal) return;

            try {
                setLoading(true);
                // Fetch data dari API
                const response = await reservasiService.fetchReservasiByJadwal(idJadwal);
                console.log("Response di component:", response);

                // Handle struktur response:
                // Cek apakah data ada di dalam properti .data (wrapper) atau di root object
                const apiData = response.data || response;

                // Validasi struktur data yang diharapkan
                if (!apiData || !apiData.jadwal) {
                    console.error("Structure mismatch. apiData:", apiData);
                    throw new Error("Data jadwal tidak ditemukan atau struktur response tidak valid");
                }

                // Transformasi data API ke format UI
                const transformedData = {
                    jadwal: {
                        idJadwal: apiData.jadwal.idJadwal,
                        plat_nomor: apiData.jadwal.bus?.plat_nomor || '-',
                        kode_bus: apiData.jadwal.bus?.kode_bus || '-',
                        tipe: apiData.jadwal.bus?.jenis_kendaraan?.tipe || '-',
                        kapasitas: apiData.jadwal.bus?.kapasitas || 0,
                        asal: apiData.jadwal.terminalNaik?.nama || '-',
                        tujuan: apiData.jadwal.terminalTurun?.nama || '-',
                        tgl_berangkat: formatDate(apiData.jadwal.tanggal_keberangkatan),
                        jam_berangkat: formatTime(apiData.jadwal.jam_keberangkatan),
                        tgl_kedatangan: formatDate(apiData.jadwal.tanggal_kedatangan),
                        jam_kedatangan: formatTime(apiData.jadwal.jam_kedatangan),
                        harga: apiData.jadwal.harga
                    },
                    stats: {
                        pending: apiData.pending,
                        paid: apiData.paid,
                        expire: apiData.expire,
                        totalPaid: apiData.totalPaid
                    },
                    // Flat map reservasi details
                    reservasi: (apiData.reservasiJadwal || []).flatMap(res =>
                        (res.reservasi_detail || []).map(detail => ({
                            id: `${res.idReservasi}-${detail.noKursi}`, // Unique ID untuk list
                            customer: res.customer?.nama || 'N/A',
                            metode: res.method?.toUpperCase() || '-',
                            kursi: detail.noKursi,
                            penumpang: detail.namaPenumpang,
                            status: res.status === 1 ? 'Paid' : (res.status === 0 ? 'Pending' : 'Expired'),
                            statusCode: res.status // 0, 1, 2
                        }))
                    )
                };

                setData(transformedData);
            } catch (err) {
                console.error("Error fetching detail:", err);
                setError(err.message || "Gagal memuat data jadwal");
                Swal.fire({
                    title: 'Error',
                    text: err.message || 'Gagal mengambil data detail jadwal',
                    icon: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idJadwal]);

    const getStatusBadge = (statusCode, statusText) => {
        if (statusCode === 1) { // Paid - Green
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    {statusText}
                </span>
            );
        } else if (statusCode === 0) { // Pending - Yellow
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    {statusText}
                </span>
            );
        } else { // Expired/Other - Red
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    {statusText}
                </span>
            );
        }
    };

    if (loading) {
        return (
            <KeuanganLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Memuat detail jadwal...</p>
                </div>
            </KeuanganLayout>
        );
    }

    if (error || !data) {
        return (
            <KeuanganLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                    <XCircle className="w-16 h-16 text-red-400 mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Gagal Memuat Data</h2>
                    <p className="text-slate-500 mb-6">{error || "Data tidak ditemukan"}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Kembali
                    </button>
                </div>
            </KeuanganLayout>
        );
    }

    return (
        <KeuanganLayout>
            <div className="p-3 bg-gray-50 min-h-screen font-sans text-gray-900">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header: Proposional */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
                            >
                                <ArrowLeft size={18} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Detail Pendapatan Jadwal</h1>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid: Lebih Terbaca */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard title="Pendapatan" value={formatCurrency(data.stats.totalPaid)} icon={<CreditCard className="text-blue-600" />} color="blue" />
                        <StatCard title="Tiket Terjual" value={`${data.stats.paid} Tiket`} icon={<CheckCircle className="text-green-600" />} color="green" />
                        <StatCard title="Pending" value={`${data.stats.pending} Transaksi`} icon={<AlertCircle className="text-yellow-600" />} color="yellow" />
                        <StatCard title="Kadaluarsa" value={`${data.stats.expire} Transaksi`} icon={<XCircle className="text-red-600" />} color="red" />
                    </div>
                    {/* Main Grid */}
                    {/* Section Rute Baru - Horizontal */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2 uppercase tracking-wide">
                            <MapPin size={16} className="text-red-600" /> Rute Perjalanan
                        </h3>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Keberangkatan */}
                            <div className="flex-1 text-left md:text-left">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Keberangkatan</p>
                                <h4 className="text-base font-bold text-slate-800 mb-3">{data.jadwal.asal}</h4>
                                <div className="inline-flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-blue-500" />
                                        <span className="text-xs font-bold text-slate-700">{data.jadwal.tgl_berangkat}</span>
                                    </div>
                                    <div className="w-px h-3 bg-slate-300"></div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-orange-500" />
                                        <span className="text-xs font-bold text-slate-700">{data.jadwal.jam_berangkat}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Line & Dots - Perbaikan Presisi Di Sini */}
                            <div className="flex items-center justify-center w-full md:w-64 lg:w-96">
                                {/* Desktop View: Garis Horizontal Menyambung */}
                                <div className="hidden md:flex items-center w-full">
                                    {/* Titik Biru */}
                                    <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm flex-shrink-0 z-10"></div>
                                    {/* Garis Tengah - Menggunakan flex-1 agar mengisi ruang kosong tepat di tengah */}
                                    <div className="flex-1 h-[2px] bg-slate-200"></div>
                                    {/* Titik Merah */}
                                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm flex-shrink-0 z-10"></div>
                                </div>

                                {/* Mobile View: Garis Vertikal Menyambung */}
                                <div className="md:hidden flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
                                    <div className="w-[2px] h-8 bg-slate-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm z-10"></div>
                                </div>
                            </div>

                            {/* Tujuan */}
                            <div className="flex-1 text-right md:text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Tujuan</p>
                                <h4 className="text-base font-bold text-slate-800 mb-3">{data.jadwal.tujuan}</h4>
                                {data.jadwal.tgl_kedatangan && (
                                    <div className="inline-flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 justify-end">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-green-500" />
                                            <span className="text-xs font-bold text-slate-700">{data.jadwal.tgl_kedatangan}</span>
                                        </div>
                                        <div className="w-px h-3 bg-slate-300"></div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-orange-500" />
                                            <span className="text-xs font-bold text-slate-700">{data.jadwal.jam_kedatangan}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* Card Informasi Armada */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2 uppercase tracking-wide">
                                    <Bus size={16} className="text-blue-600" /> Informasi Armada
                                </h3>
                                <div className="space-y-1">
                                    <InfoRow label="Kode Bus" value={data.jadwal.kode_bus} />
                                    <InfoRow label="Plat Nomor" value={data.jadwal.plat_nomor} />
                                    <InfoRow label="Tipe" value={data.jadwal.tipe} />
                                    <InfoRow label="Kapasitas" value={`${data.jadwal.kapasitas} Kursi`} />
                                    <InfoRow label="Harga Tiket" value={formatCurrency(data.jadwal.harga)} />
                                </div>
                            </div>


                        </div>

                        {/* Table Area: Font Size Standar */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-white flex-wrap gap-4">
                                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-widest">Daftar Akun Reservasi</h3>
                                    <span className="text-xs font-medium text-slate-500">Total {getFilteredReservasi().length} Kursi Terisi</span>
                                </div>
                                
                                {/* Filter Section */}
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 grid grid-cols-2 md:grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Filter Status</label>
                                        <select 
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        >
                                            <option value="all">Semua Status</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Expired">Expired</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Filter Metode</label>
                                        <select 
                                            value={filterMetode}
                                            onChange={(e) => setFilterMetode(e.target.value)}
                                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        >
                                            <option value="all">Semua Metode</option>
                                            {data?.reservasi && [...new Set(data.reservasi.map(r => r.metode))].map(metode => (
                                                <option key={metode} value={metode}>{metode}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                                            <tr>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4 text-center">Kursi</th>
                                                <th className="px-6 py-4">Metode</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {getFilteredReservasi().length > 0 ? (
                                                getFilteredReservasi().map((res) => (
                                                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm font-bold text-gray-800 uppercase">{res.customer}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">
                                                                {res.kursi}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs font-medium text-gray-600">{res.metode}</td>
                                                        <td className="px-6 py-4">
                                                            {getStatusBadge(res.statusCode, res.status)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-800">
                                                            {formatCurrency(data.jadwal.harga)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                        {data.reservasi.length === 0 
                                                            ? 'Belum ada data reservasi untuk jadwal ini.' 
                                                            : 'Tidak ada data yang sesuai dengan filter.'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </KeuanganLayout>
    );
};

export default DetailPendapatanJadwal;