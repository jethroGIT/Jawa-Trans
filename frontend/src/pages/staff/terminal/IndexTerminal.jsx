import StaffLayout from '../../../layouts/StaffLayout'; // Sesuaikan path
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Pencil,
    Trash2,
    Plus,
    Search,
    AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';

// Import Komponen Pagination
import Pagination from '../../../components/staff/bus/Pagination';

// DATA DUMMY TERMINAL
const DUMMY_TERMINAL = [
    { idTerminal: 1, kota: 'Yogyakarta', nama: 'Terminal Giwangan' },
    { idTerminal: 2, kota: 'Surakarta', nama: 'Terminal Tirtonadi' },
    { idTerminal: 3, kota: 'Surabaya', nama: 'Terminal Bungurasih' },
    { idTerminal: 4, kota: 'Jakarta Timur', nama: 'Terminal Pulo Gebang' },
    { idTerminal: 5, kota: 'Bandung', nama: 'Terminal Cicaheum' },
    { idTerminal: 6, kota: 'Malang', nama: 'Terminal Arjosari' },
    { idTerminal: 7, kota: 'Semarang', nama: 'Terminal Terboyo' },
    { idTerminal: 8, kota: 'Denpasar', nama: 'Terminal Mengwi' },
];

export default function IndexTerminal() {
    // --- STATE ---
    const [terminals, setTerminals] = useState(DUMMY_TERMINAL);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- LOGIC ---

    // 1. Filtering
    const filteredTerminals = terminals.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kota.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Slicing Data (Pagination)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTerminals.slice(indexOfFirstItem, indexOfLastItem);

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
            title: 'Hapus Terminal?',
            text: "Data terminal yang dihapus mungkin berpengaruh pada jadwal yang ada!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedTerminals = terminals.filter(t => t.idTerminal !== id);
                setTerminals(updatedTerminals);

                // Logic mundur halaman jika item terakhir di page tersebut dihapus
                const newFiltered = updatedTerminals.filter(item =>
                    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const totalPages = Math.ceil(newFiltered.length / itemsPerPage);

                if (currentPage > totalPages && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }

                Swal.fire('Terhapus!', 'Data terminal berhasil dihapus.', 'success');
            }
        });
    };

    return (
        <StaffLayout>
            <div className="space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Data Terminal</h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola daftar lokasi keberangkatan dan tujuan</p>
                    </div>

                    <Link
                        to="/mitra/terminal/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Terminal
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama terminal atau kota..."
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
                                    <th className="px-6 py-4 border-b border-slate-200 w-1/4">Kota / Lokasi</th>
                                    <th className="px-6 py-4 border-b border-slate-200 w-1/2">Nama Terminal</th>
                                    <th className="px-6 py-4 border-b border-slate-200 text-center w-1/4">Aksi</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-slate-100">
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.idTerminal} className="hover:bg-slate-50 transition-colors duration-150">

                                            {/* Kolom Kota */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {item.kota}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Kolom Nama Terminal */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {item.nama}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Kolom Aksi */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        to={`/mitra/terminal/${item.idTerminal}`}
                                                        className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                                                        title="Edit Terminal"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(item.idTerminal)}
                                                        className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md"
                                                        title="Hapus Terminal"
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
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                                                    <AlertCircle className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-slate-600">
                                                        {searchTerm ? 'Terminal tidak ditemukan.' : 'Belum ada data terminal.'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Tambahkan terminal tujuan atau keberangkatan baru.
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
                        totalItems={filteredTerminals.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </StaffLayout>
    );
}