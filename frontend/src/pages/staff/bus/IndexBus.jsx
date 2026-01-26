import StaffLayout from '../../../layouts/StaffLayout';
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, List, BusFront, CreditCard, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

import StatusBadge from '../../../components/staff/bus/StatusBadge';
import busService from '../../../services/mitra/busService';

export default function IndexBus() {
    const [buses, setBuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const navigate = useNavigate();

    // Fetch Data Bus on mount
    useEffect(() => {
        const loadBuses = async () => {
            try {
                setIsLoading(true);

                const data = await busService.fetchAllBus();

                // Transform data to match table format
                const transformedData = data.map(bus => ({
                    idBus: bus.idBus,
                    platNomor: bus.plat_nomor || '-',
                    kodeBus: bus.kode_bus || '-',
                    tipe: bus.tipe_bus?.tipe || '-',
                    status: bus.status
                }));

                setBuses(transformedData);
            } catch (error) {
                console.error('Error loading buses:', error);
                Swal.fire('Error', error.message, 'error');
                setBuses([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadBuses();
    }, []);

    // 2. Update Filter agar mendukung pencarian Plat Nomor
    const filteredBuses = useMemo(() => {
        return buses.filter((bus) => {
            const lowerSearch = searchTerm.toLowerCase();
            const matchSearch =
                bus.platNomor.toLowerCase().includes(lowerSearch) ||
                bus.kodeBus.toLowerCase().includes(lowerSearch) ||
                bus.tipe.toLowerCase().includes(lowerSearch);

            const matchType = selectedType ? bus.tipe === selectedType : true;

            return matchSearch && matchType;
        });
    }, [searchTerm, selectedType, buses]);

    const ActionButtons = ({ id }) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => navigate(`/mitra/bus/${id}`)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                title="Edit Data"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(id)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md"
                title="Hapus Data"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    // 3. Update Konfigurasi Kolom DataTable
    const columns = [
        {
            data: 'platNomor',
            title: 'Plat Nomor',
            render: (data) => `<span class="font-bold text-slate-900 tracking-wide">${data}</span>`
        },
        {
            data: 'kodeBus',
            title: 'Kode Bus',
            className: 'text-slate-600 font-medium'
        },
        {
            data: 'tipe',
            title: 'Tipe Bus',
            className: 'text-slate-600'
        },
        {
            data: 'status',
            title: 'Status',
            className: 'text-center',
            render: (data) => { return '<div class="status-cell"></div>'; }
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
            title: 'Hapus Armada?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const updatedBuses = buses.filter(bus => bus.idBus !== id);
                    setBuses(updatedBuses);
                    await busService.fetchDeleteBus(id);
                    Swal.fire('Terhapus!', 'Data bus berhasil dihapus.', 'success');
                } catch (error) {
                    Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data.', 'error');
                }
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
                                        placeholder="Cari plat / kode / tipe..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all hover:bg-slate-100 hover:border-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-48 group">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Tipe Bus</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <BusFront className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full pl-10 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-slate-100 hover:border-slate-300"
                                    >
                                        <option value="">Semua Tipe</option>
                                        <option value="Economy">Economy</option>
                                        <option value="Executive">Executive</option>
                                        <option value="Super Executive">Super Executive</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/mitra/bus/create"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all h-[42px] flex-shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Bus
                        </Link>
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                                <p>Memuat data bus...</p>
                            </div>
                        ) : buses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <p>Tidak ada data bus</p>
                            </div>
                        ) : (
                            <DataTable
                                data={filteredBuses}
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
                                        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                                        infoEmpty: "Tidak ada data",
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
                                            root.render(<ActionButtons id={data.idBus} />);
                                        }
                                        const statusCell = row.querySelector('.status-cell');
                                        if (statusCell) {
                                            const rootStatus = createRoot(statusCell);
                                            rootStatus.render(<StatusBadge status={data.status} />);
                                        }
                                    }
                                }}
                            >
                                {/* 4. Update Header Table (thead) */}
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Plat Nomor</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Kode Bus</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Tipe Bus</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Aksi</th>
                                    </tr>
                                </thead>
                            </DataTable>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}