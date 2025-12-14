import StaffLayout from '../../../layouts/StaffLayout';
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Calendar, CalendarDays, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';

// --- DATATABLES IMPORTS ---
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

const DUMMY_JADWAL = [
    { idJadwal: 1, kodeBus: 'BUS-019', terminalNaik: 'Terminal Bungurasih', terminalTurun: 'Terminal Tirtonadi', tanggal: '2023-12-09T09:48:21' },
    { idJadwal: 2, kodeBus: 'BUS-017', terminalNaik: 'Terminal Terboyo', terminalTurun: 'Terminal Purbaya', tanggal: '2024-01-18T17:41:42' },
    { idJadwal: 3, kodeBus: 'BUS-018', terminalNaik: 'Terminal Purbaya', terminalTurun: 'Terminal Ubung', tanggal: '2024-01-16T15:07:09' },
    { idJadwal: 4, kodeBus: 'BUS-011', terminalNaik: 'Terminal Leuwi Panjang', terminalTurun: 'Terminal Terboyo', tanggal: '2024-01-09T12:41:34' },
    { idJadwal: 5, kodeBus: 'BUS-004', terminalNaik: 'Terminal Leuwi Panjang', terminalTurun: 'Terminal Cicaheum', tanggal: '2023-12-16T04:29:03' },
    { idJadwal: 6, kodeBus: 'BUS-008', terminalNaik: 'Terminal Leuwi Panjang', terminalTurun: 'Terminal Mengwi', tanggal: '2023-12-17T22:07:47' },
    { idJadwal: 7, kodeBus: 'BUS-008', terminalNaik: 'Terminal Kampung Rambutan', terminalTurun: 'Terminal Ubung', tanggal: '2024-01-08T12:32:13' },
    { idJadwal: 8, kodeBus: 'BUS-015', terminalNaik: 'Terminal Giwangan', terminalTurun: 'Terminal Mengwi', tanggal: '2024-01-13T10:47:10' },
    { idJadwal: 9, kodeBus: 'BUS-007', terminalNaik: 'Terminal Giwangan', terminalTurun: 'Terminal Ubung', tanggal: '2023-12-13T05:00:12' },
    { idJadwal: 10, kodeBus: 'BUS-015', terminalNaik: 'Terminal Purbaya', terminalTurun: 'Terminal Tirtonadi', tanggal: '2024-01-18T15:08:54' },
];

export default function IndexJadwal() {
    const [jadwals, setJadwals] = useState(DUMMY_JADWAL);

    // --- STATE FILTER & SEARCH ---
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const months = [
        { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
        { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
    ];

    // Ambil tahun unik dari data
    const uniqueYears = useMemo(() => {
        const years = jadwals.map(item => new Date(item.tanggal).getFullYear());
        return [...new Set(years)].sort((a, b) => b - a);
    }, [jadwals]);

    // --- LOGIKA FILTER UTAMA ---
    const filteredData = useMemo(() => {
        return jadwals.filter(item => {
            const itemDate = new Date(item.tanggal);
            const itemMonth = itemDate.getMonth() + 1;
            const itemYear = itemDate.getFullYear();

            const matchMonth = selectedMonth ? itemMonth === parseInt(selectedMonth) : true;
            const matchYear = selectedYear ? itemYear === parseInt(selectedYear) : true;

            const searchLower = searchTerm.toLowerCase();
            const matchSearch =
                item.kodeBus.toLowerCase().includes(searchLower) ||
                item.terminalNaik.toLowerCase().includes(searchLower) ||
                item.terminalTurun.toLowerCase().includes(searchLower);

            return matchMonth && matchYear && matchSearch;
        });
    }, [jadwals, selectedMonth, selectedYear, searchTerm]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Komponen Tombol Aksi (React)
    const ActionButtons = ({ id }) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => navigate(`/mitra/jadwal/${id}`)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                title="Update Jadwal"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(id)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md"
                title="Hapus Jadwal"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    const columns = [
        { data: 'kodeBus', title: 'Kode Bus' },
        { data: 'terminalNaik', title: 'Terminal Naik' },
        { data: 'terminalTurun', title: 'Terminal Turun' },
        {
            data: 'tanggal',
            title: 'Waktu Keberangkatan',
            render: (data) => `<span class="font-medium text-slate-700">${formatDate(data)}</span>`
        },
        {
            data: null,
            title: 'Aksi',
            orderable: false,
            className: 'text-center',
            defaultContent: '<div class="action-cell"></div>'
        }
    ];

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Jadwal?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus'
        }).then((result) => {
            if (result.isConfirmed) {
                setJadwals(prev => prev.filter(j => j.idJadwal !== id));
                Swal.fire('Terhapus!', 'Jadwal berhasil dihapus.', 'success');
            }
        });
    };

    return (
        <StaffLayout>
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-slate-100 flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-white">
                        <div className="flex flex-col md:flex-row md:items-end gap-4 w-full lg:w-auto">
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
                                        placeholder="Cari bus / terminal..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all hover:bg-slate-100 hover:border-slate-300"
                                    />
                                </div>
                            </div>

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

                        <div className="flex-shrink-0">
                            <Link
                                to="/mitra/jadwal/create"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all h-[42px] w-full lg:w-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Jadwal
                            </Link>
                        </div>

                    </div>

                    <div className="p-0">
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
                                    infoFiltered: "",
                                    zeroRecords: "Pencarian tidak ditemukan",
                                    paginate: {
                                        next: "Next",
                                        previous: "Prev"
                                    }
                                },
                                createdRow: (row, data) => {
                                    const actionCell = row.querySelector('.action-cell');
                                    if (actionCell) {
                                        const root = createRoot(actionCell);
                                        root.render(<ActionButtons id={data.idJadwal} />);
                                    }
                                }
                            }}
                        >
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-600">Kode Bus</th>
                                    <th className="px-6 py-4 font-semibold text-slate-600">Terminal Naik</th>
                                    <th className="px-6 py-4 font-semibold text-slate-600">Terminal Turun</th>
                                    <th className="px-6 py-4 font-semibold text-slate-600">Waktu Keberangkatan</th>
                                    <th className="px-6 py-4 font-semibold text-slate-600 text-center">Aksi</th>
                                </tr>
                            </thead>
                        </DataTable>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}