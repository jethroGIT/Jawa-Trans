import KeuanganLayout from '../../../layouts/KeuanganLayout';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Calendar,
    CalendarDays,
    Loader2,
    CreditCard,
    BusFront,
    TrendingUp
} from 'lucide-react';
import Swal from 'sweetalert2';
import reservasiService from '../../../services/keuangan/reservasiService';

// --- DATATABLES IMPORTS ---
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

export default function LaporanKeuangan() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE FILTER & SEARCH ---
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data jadwal dengan tiket terjual dan pemasukan dari API
    useEffect(() => {
        const loadReports = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Backend sudah mengembalikan data jadwal dengan tiketTerjual dan pemasukan
                const scheduleData = await reservasiService.fetchReservasiByMitra();

                // Transform data untuk tampilan
                const jadwalArray = scheduleData.map((jadwal) => ({
                    idJadwal: jadwal.idJadwal,
                    rute: `${jadwal.terminalNaik?.nama || 'N/A'} → ${jadwal.terminalTurun?.nama || 'N/A'} `,
                    tanggal: jadwal.tanggal_keberangkatan,
                    jam: jadwal.jam_keberangkatan,
                    bus: `${jadwal.bus?.jenis_kendaraan?.tipe || 'N/A'} - ${jadwal.bus?.plat_nomor || 'N/A'} `,
                    operator: jadwal.bus?.jenis_kendaraan?.mitra?.nama || 'N/A',
                    hargaSatuan: jadwal.harga || 0,
                    kapasitas: jadwal.bus?.kapasitas || 0,
                    tiketTerjual: jadwal.jumlahTerjual || 0,
                    pemasukan: jadwal.totalPendapatan || 0
                }));

                setReports(jadwalArray);

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
        const currentYear = new Date().getFullYear(); // 2026

        // Extract tahun dari data reports
        const yearsFromData = reports
            .filter(item => item.tanggal)
            .map(item => new Date(item.tanggal).getFullYear());

        // Gabung dengan tahun terkini dan 3 tahun sebelumnya
        const allYears = new Set([
            currentYear,
            currentYear - 1,
            currentYear - 2,
            currentYear - 3,
            ...yearsFromData
        ]);

        return Array.from(allYears).sort((a, b) => b - a);
    }, [reports]);

    const filteredData = useMemo(() => {
        return reports.filter(item => {
            const itemMonth = item.tanggal ? new Date(item.tanggal).getMonth() + 1 : null;
            const itemYear = item.tanggal ? new Date(item.tanggal).getFullYear() : null;

            const matchMonth = selectedMonth ? itemMonth === parseInt(selectedMonth) : true;
            const matchYear = selectedYear ? itemYear === parseInt(selectedYear) : true;
            const matchSearch = item.rute.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.bus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.operator.toLowerCase().includes(searchTerm.toLowerCase());

            return matchMonth && matchYear && matchSearch;
        });
    }, [reports, selectedMonth, selectedYear, searchTerm]);

    // --- KPI DINAMIS BERDASARKAN FILTER ---
    const { totalJadwal, totalTiketTerjual, totalPendapatan } = useMemo(() => {
        const totalJadwal = filteredData.length;
        const totalTiketTerjual = filteredData.reduce((sum, item) => sum + (item.tiketTerjual || 0), 0);
        const totalPendapatan = filteredData.reduce((sum, item) => sum + (item.pemasukan || 0), 0);
        return { totalJadwal, totalTiketTerjual, totalPendapatan };
    }, [filteredData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
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

    const handleViewDetail = (jadwalData) => {
        Swal.fire({
            title: 'Detail Jadwal',
            titleClass: 'text-2xl font-bold',
            html: `
                <div class="text-left space-y-4 text-base">
                    <div class="border-b pb-3"><strong class="text-slate-700">Rute:</strong> <span class="text-slate-600">${jadwalData.rute}</span></div>
                    <div class="border-b pb-3"><strong class="text-slate-700">Tanggal:</strong> <span class="text-slate-600">${formatDate(jadwalData.tanggal)}</span></div>
                    <div class="border-b pb-3"><strong class="text-slate-700">Jam:</strong> <span class="text-slate-600">${formatTime(jadwalData.jam)}</span></div>
                    <div class="border-b pb-3"><strong class="text-slate-700">Armada:</strong> <span class="text-slate-600">${jadwalData.bus}</span></div>
                    <div class="border-b pb-3"><strong class="text-slate-700">Operator:</strong> <span class="text-slate-600">${jadwalData.operator}</span></div>
                    <div class="border-b pb-3"><strong class="text-slate-700">Kapasitas:</strong> <span class="text-slate-600">${jadwalData.kapasitas} kursi</span></div>
                    <div class="border-b pb-3"><strong class="text-slate-700">Tiket Terjual:</strong> <span class="text-slate-600">${jadwalData.tiketTerjual}</span></div>
                    <div class="border-b pb-3"><strong class="text-slate-700">Harga Satuan:</strong> <span class="text-slate-600">${formatCurrency(jadwalData.hargaSatuan)}</span></div>
                    <div><strong class="text-slate-700">Pemasukan:</strong> <span class="text-green-600 font-bold text-lg">${formatCurrency(jadwalData.pemasukan)}</span></div>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Tutup',
            confirmButtonClass: 'text-base px-6 py-2',
            width: 600,
            didOpen: () => {
                const htmlContainer = Swal.getHtmlContainer();
                if (htmlContainer) htmlContainer.style.fontSize = '1rem';
            }
        });
    };

    const columns = [
        {
            data: 'rute',
            title: 'Rute Perjalanan',
            render: (data) => `<div class="font-medium text-slate-800 text-sm">${data}</div>`
        },
        {
            data: 'tanggal',
            title: 'Tanggal',
            render: (data) => `<div class="text-sm text-slate-700">${formatDate(data)}</div>`
        },
        {
            data: 'bus',
            title: 'Armada',
            render: (data) => `<span class="text-xs text-slate-700">${data}</span>`
        },
        {
            data: 'tiketTerjual',
            title: 'Tiket Terjual',
            className: 'text-center',
            render: (data) => `<span class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">${data}</span>`
        },
        {
            data: 'pemasukan',
            title: 'Pemasukan',
            className: 'text-right',
            render: (data) => `<div class="font-bold text-green-600">${formatCurrency(data)}</div>`
        },
        {
            data: 'idJadwal',
            title: 'Action',
            orderable: false,
            searchable: false,
            render: (data, type, row) => `<button class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200" onclick="window.showJadwalDetail(${row.idJadwal})">Detail</button>`
        }
    ];

    window.showJadwalDetail = (idJadwal) => {
        navigate(`/keuangan/detail-jadwal/${idJadwal}`);
    };

    return (
        <KeuanganLayout>
            <div className="space-y-6">
                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BusFront className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Jadwal</p>
                            <h3 className="text-xl font-bold text-slate-900">{totalJadwal}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tiket Terjual</p>
                            <h3 className="text-xl font-bold text-slate-900">{totalTiketTerjual} Tiket</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CreditCard className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pemasukan</p>
                            <h3 className="text-xl font-bold text-slate-900">{formatCurrency(totalPendapatan)}</h3>
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
                                        placeholder="Cari rute, armada, operator..."
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
                                    lengthMenu: [[5, 10, 20, 50, -1], [5, 10, 20, 50, "Semua"]],
                                    pageLength: 5,
                                    dom: 'tr<"flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4"lip>',
                                    language: {
                                        lengthMenu: "_MENU_",
                                        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ jadwal",
                                        infoEmpty: "Tidak ada data",
                                        zeroRecords: "Jadwal tidak ditemukan",
                                        paginate: {
                                            next: "Next",
                                            previous: "Prev"
                                        }
                                    }
                                }}
                            >
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Rute</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Tanggal</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Armada</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Tiket Terjual</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-right">Pemasukan</th>
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