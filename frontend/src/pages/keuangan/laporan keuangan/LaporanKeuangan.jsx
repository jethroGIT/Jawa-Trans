import KeuanganLayout from '../../../layouts/KeuanganLayout';
import { useState, useMemo, useEffect } from 'react';
import { 
    Search, 
    Calendar, 
    CalendarDays, 
    Filter, 
    Loader2, 
    CreditCard, 
    BusFront 
} from 'lucide-react';
import Swal from 'sweetalert2';
import reservasiService from '../../../services/keuangan/reservasiService';

// --- DATATABLES IMPORTS ---
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

export default function LaporanKeuangan() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPendapatan, setTotalPendapatan] = useState(0);
    const [totalTiket, setTotalTiket] = useState(0);

    // --- STATE FILTER & SEARCH ---
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data reservasi dari API
    useEffect(() => {
        const loadReports = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const reservasiData = await reservasiService.fetchReservasiByMitra();
                
                // Transform data reservasi ke format laporan
                const transformedData = reservasiData.map((res, idx) => ({
                    id: res.idReservasi,
                    bus: res.jadwal?.bus?.tipe_bus?.tipe ? `${res.jadwal.bus.tipe_bus.tipe} - ${res.jadwal.bus.plat_nomor}` : 'N/A',
                    penumpang: res.penumpang,
                    total: res.totalHarga,
                    status: res.status === 'paid' ? 'Lunas' : res.status === 'pending' ? 'Pending' : res.status === 'expired' ? 'Dibatalkan' : res.status, 
                    waktu: res.waktuBayar ? new Date(res.waktuBayar) : null
                }));
                
                setReports(transformedData);
                
                // Hitung total pendapatan dan tiket
                const total = transformedData.reduce((sum, item) => sum + item.total, 0);
                const tiket = transformedData.reduce((sum, item) => sum + item.penumpang, 0);
                setTotalPendapatan(total);
                setTotalTiket(tiket);
            } catch (err) {
                setError(err.message);
                Swal.fire({
                    title: 'Error',
                    text: err.message || 'Gagal mengambil data laporan keuangan',
                    icon: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadReports();
    }, []);

    const months = [
        { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
        { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
    ];

    const uniqueYears = useMemo(() => {
        const years = reports
            .filter(item => item.waktu)
            .map(item => item.waktu.getFullYear());
        return [...new Set(years)].sort((a, b) => b - a);
    }, [reports]);

    const filteredData = useMemo(() => {
        return reports.filter(item => {
            const itemMonth = item.waktu ? item.waktu.getMonth() + 1 : null;
            const itemYear = item.waktu ? item.waktu.getFullYear() : null;

            const matchMonth = selectedMonth ? itemMonth === parseInt(selectedMonth) : true;
            const matchYear = selectedYear ? itemYear === parseInt(selectedYear) : true;
            const matchSearch = item.bus.toLowerCase().includes(searchTerm.toLowerCase());

            return matchMonth && matchYear && matchSearch;
        });
    }, [reports, selectedMonth, selectedYear, searchTerm]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    const formatWaktuBayar = (waktuBayar) => {
        if (!waktuBayar) return 'Belum Bayar';
        const date = new Date(waktuBayar);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    const columns = [
        { 
            data: 'bus', 
            title: 'Bus',
            render: (data) => `<span class="font-bold text-slate-800 text-xs">${data}</span>`
        },
        { 
            data: 'penumpang', 
            title: 'Jumlah Penumpang',
            className: 'text-center text-slate-600',
            render: (data) => `${data} Orang`
        },
        { 
            data: 'total', 
            title: 'Total Harga',
            className: 'text-right font-bold text-blue-600',
            render: (data) => formatCurrency(data)
        },
        { 
            data: 'status', 
            title: 'Status',
            className: 'text-center',
            render: (data) => {
                const color = data === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
                return `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}">${data}</span>`;
            }
        },
        {
            data: 'waktu',
            title: 'Waktu Bayar',
            render: (data) => `<span class="text-xs text-slate-500">${data ? formatWaktuBayar(data) : 'Belum Bayar'}</span>`
        }
    ];

    return (
        <KeuanganLayout>
            <div className="space-y-6">
                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CreditCard className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pendapatan</p>
                            <h3 className="text-xl font-bold text-slate-900">{formatCurrency(totalPendapatan)}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><BusFront className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tiket Terjual</p>
                            <h3 className="text-xl font-bold text-slate-900">{totalTiket} Tiket</h3>
                        </div>
                    </div>
                </div>

                {/* Table & Filter Section */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-slate-100 flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-white">
                        <div className="flex flex-col md:flex-row md:items-end gap-4 w-full lg:w-auto">
                            {/* Filter Pencarian */}
                            <div className="w-full md:w-64 group">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Pencarian</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari bus..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all hover:bg-slate-100 hover:border-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Filter Bulan */}
                            <div className="w-full md:w-48 group">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Bulan</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-slate-100 hover:border-slate-300"
                                    >
                                        <option value="">Semua Bulan</option>
                                        {months.map((m) => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Filter Tahun */}
                            <div className="w-full md:w-40 group">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Tahun</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <CalendarDays className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-slate-100 hover:border-slate-300"
                                    >
                                        <option value="">Semua Tahun</option>
                                        {uniqueYears.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                                <p>Memuat rincian laporan...</p>
                            </div>
                        ) : (
                            <DataTable
                                data={filteredData}
                                columns={columns}
                                className="display w-full text-left border-collapse"
                                options={{
                                    responsive: true,
                                    destroy: true,
                                    searching: false, 
                                    paging: true,
                                    lengthMenu: [ [5, 10, 20, 50, -1], [5, 10, 20, 50, "Semua"] ],
                                    pageLength: 5,
                                    dom: 'tr<"flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4"lip>',
                                     language: {
                                        lengthMenu: "_MENU_",
                                        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                                        infoEmpty: "Tidak ada data",
                                        zeroRecords: "Laporan tidak ditemukan",
                                        paginate: {
                                            next: "Next",
                                            previous: "Prev"
                                        }
                                    }
                                }}
                            >
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Bus</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Jumlah Penumpang</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-right">Total Harga</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Waktu Bayar</th>
                                    </tr>
                                </thead>
                            </DataTable>
                        )}
                    </div>
                </div>
            </div>
        </KeuanganLayout>
    );
}