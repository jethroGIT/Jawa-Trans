import StaffLayout from '../../../layouts/StaffLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, Search, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

import StatusBadge from '../../../components/staff/bus/StatusBadge';
import Pagination from '../../../components/staff/bus/Pagination';
import busService from '../../../services/mitra/busService';

// Data Dummy
const DUMMY_DATA = [
    { idBus:1, kodeBus: 'BUS-001', tipe: 'Executive', kapasitas: 32, status: 'aktif' },
    { idBus:2, kodeBus: 'BUS-002', tipe: 'Super Executive', kapasitas: 24, status: 'perbaikan' },
    { idBus:3, kodeBus: 'BUS-003', tipe: 'Economy', kapasitas: 50, status: 'perbaikan' },
    { idBus:4, kodeBus: 'BUS-004', tipe: 'Executive', kapasitas: 32, status: 'aktif' },
    { idBus:5, kodeBus: 'BUS-005', tipe: 'Super Executive', kapasitas: 24, status: 'aktif' },
    { idBus:6, kodeBus: 'BUS-006', tipe: 'Economy', kapasitas: 50, status: 'tidak aktif' },
    { idBus:7, kodeBus: 'BUS-007', tipe: 'Executive', kapasitas: 32, status: 'perbaikan' },
    { idBus:8, kodeBus: 'BUS-008', tipe: 'Super Executive', kapasitas: 24, status: 'aktif' },
    { idBus:18, kodeBus: 'BUS-011', tipe: 'Super Executive', kapasitas: 24, status: 'aktif' },
];

export default function IndexBus() {
    // --- STATE ---
    const [buses, setBuses] = useState(DUMMY_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- LOGIC ---

    // 1. Filtering
    const filteredBuses = buses.filter((bus) =>
        bus.kodeBus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.tipe.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Slicing (Memotong data untuk halaman saat ini)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBuses.slice(indexOfFirstItem, indexOfLastItem);

    // --- HANDLERS ---

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset ke hal 1 saat mencari
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Armada?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedBuses = buses.filter(bus => bus.idBus !== id);
                setBuses(updatedBuses);
                
                const deleteBus = await busService.fetchDeleteBus(id);
                console.log(deleteBus);

                // Cek jika halaman jadi kosong setelah hapus
                const newFiltered = updatedBuses.filter(bus =>
                    bus.kodeBus.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const totalPages = Math.ceil(newFiltered.length / itemsPerPage);

                if (currentPage > totalPages && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }

                Swal.fire('Terhapus!', 'Data bus berhasil dihapus.', 'success');
            }
        });
    };

    return (
        <StaffLayout>
            <div className="space-y-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manajemen Armada</h1>
                        <p className="text-slate-500 text-sm">Kelola data bus dan status operasional</p>
                    </div>
                    <Link
                        to="/mitra/bus/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-200"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Bus
                    </Link>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari kode bus atau tipe..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={handleSearch}
                            value={searchTerm}
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 border-b border-slate-200">Kode Bus</th>
                                    <th className="px-6 py-4 border-b border-slate-200">Tipe Bus</th>
                                    <th className="px-6 py-4 border-b border-slate-200 text-center">Kapasitas</th>
                                    <th className="px-6 py-4 border-b border-slate-200 text-center">Status</th>
                                    <th className="px-6 py-4 border-b border-slate-200 text-center">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {currentItems.length > 0 ? (
                                    currentItems.map((bus) => (
                                        <tr key={bus.idBus} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-slate-900">{bus.kodeBus}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{bus.tipe}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 text-center">{bus.kapasitas} Kursi</td>

                                            {/* --- Menggunakan Komponen StatusBadge --- */}
                                            <td className="px-6 py-4 text-center">
                                                <StatusBadge status={bus.status} />
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        to={`/mitra/bus/${bus.idBus}`}
                                                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                                                        title="Edit Data"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(bus.idBus)}
                                                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md"
                                                        title="Hapus Data"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="p-3 bg-slate-100 rounded-full">
                                                    <AlertCircle className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <p className="text-sm">{searchTerm ? 'Data tidak ditemukan.' : 'Belum ada data armada.'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Menggunakan Komponen Pagination --- */}
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredBuses.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </StaffLayout>
    );
}