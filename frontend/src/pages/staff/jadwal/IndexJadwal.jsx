import StaffLayout from '../../../layouts/StaffLayout'; // Sesuaikan path
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Pencil,
    Trash2,
    Plus,
    Search,
    AlertCircle,
} from 'lucide-react';
import Swal from 'sweetalert2';

// Import Komponen Pagination yang sudah dibuat sebelumnya
import Pagination from '../../../components/staff/bus/Pagination';
import jadwalService from '../../../services/mitra/jadwalService';

// DATA DUMMY JADWAL
const DUMMY_JADWAL = [
    {idJadwal: 1, kodeBus: 'BUS-001', terminalNaik: 'Terminal Giwangan', terminalTurun: 'Terminal Bungurasih', tanggal: '2023-12-25T08:00:00' },
    {idJadwal: 2, kodeBus: 'BUS-002', terminalNaik: 'Terminal Tirtonadi', terminalTurun: 'Terminal Pulo Gebang', tanggal: '2023-12-25T16:00:00' },
    {idJadwal: 3, kodeBus: 'BUS-001', terminalNaik: 'Terminal Bungurasih', terminalTurun: 'Terminal Giwangan', tanggal: '2023-12-26T09:00:00' },
    {idJadwal: 4, kodeBus: 'BUS-003', terminalNaik: 'Terminal Arjosari', terminalTurun: 'Terminal Giwangan', tanggal: '2023-12-26T07:30:00' },
    {idJadwal: 5, kodeBus: 'BUS-004', terminalNaik: 'Terminal Giwangan', terminalTurun: 'Terminal Cicaheum', tanggal: '2023-12-27T19:00:00' },
    {idJadwal: 6, kodeBus: 'BUS-005', terminalNaik: 'Terminal Pulo Gebang', terminalTurun: 'Terminal Tirtonadi', tanggal: '2023-12-27T15:00:00' },
    {idJadwal: 10, kodeBus: 'BUS-005', terminalNaik: 'Terminal Pulo Gebang', terminalTurun: 'Terminal Tirtonadi', tanggal: '2023-12-27T15:00:00' },
];

export default function IndexJadwal() {
    // --- STATE ---
    const [jadwals, setJadwals] = useState(DUMMY_JADWAL);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- HELPER: FORMAT TANGGAL ---
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // --- LOGIC ---

    // 1. Filtering (Berdasarkan Kode Bus, Terminal Asal, atau Tujuan)
    const filteredJadwal = jadwals.filter((item) =>
        item.kodeBus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.terminalNaik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.terminalTurun.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Slicing Data untuk Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredJadwal.slice(indexOfFirstItem, indexOfLastItem);

    // --- HANDLERS ---

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Jadwal?',
            text: "Jadwal yang dihapus akan membatalkan tiket yang terkait (jika ada)!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedJadwal = jadwals.filter(j => j.idJadwal !== id);
                setJadwals(updatedJadwal);

                const deleteJadwal = await jadwalService.fetchDeleteJadwal(id);
                console.log(deleteJadwal.message)

                // Logic mundur halaman jika data habis di halaman terakhir
                const newFiltered = updatedJadwal.filter(item =>
                    item.kodeBus.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const totalPages = Math.ceil(newFiltered.length / itemsPerPage);
                if (currentPage > totalPages && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }

                Swal.fire('Terhapus!', 'Data jadwal berhasil dihapus.', 'success');
            }
        });
    };

    return (
        <StaffLayout>
            <div className="space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manajemen Jadwal</h1>
                        <p className="text-slate-500 text-sm mt-1">Atur rute dan waktu keberangkatan armada</p>
                    </div>

                    <Link
                        to="/mitra/jadwal/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Jadwal
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari kode bus, terminal asal/tujuan..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            onChange={handleSearch}
                            value={searchTerm}
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* Table Header */}
                            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 border-b border-slate-200">Kode Bus</th>
                                    <th className="px-6 py-4 border-b border-slate-200">Terminal Naik</th>
                                    <th className="px-6 py-4 border-b border-slate-200">Terminal Turun</th>
                                    <th className="px-6 py-4 border-b border-slate-200">Tanggal Keberangkatan</th>
                                    <th className="px-6 py-4 border-b border-slate-200 text-center">Aksi</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-slate-100">
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.idJadwal} className="hover:bg-slate-50 transition-colors duration-150">
                                            {/* Kolom Kode Bus */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {item.kodeBus}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Kolom Terminal Naik */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <span className="text-sm">{item.terminalNaik}</span>
                                                </div>
                                            </td>

                                            {/* Kolom Terminal Turun */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <span className="text-sm">{item.terminalTurun}</span>
                                                </div>
                                            </td>

                                            {/* Kolom Tanggal */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <span className="text-sm font-medium">
                                                        {formatDate(item.tanggal)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Kolom Aksi */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        to={`/mitra/jadwal/${item.idJadwal}`}
                                                        className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                                                        title="Update Jadwal"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(item.idJadwal)}
                                                        className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md"
                                                        title="Hapus Jadwal"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    /* Empty State */
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                                                    <AlertCircle className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-slate-600">
                                                        {searchTerm ? 'Jadwal tidak ditemukan.' : 'Belum ada jadwal keberangkatan.'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Silakan buat jadwal baru untuk armada Anda.
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Component */}
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredJadwal.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </StaffLayout>
    );
}