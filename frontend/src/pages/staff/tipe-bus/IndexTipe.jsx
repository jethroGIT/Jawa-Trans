import StaffLayout from '../../../layouts/StaffLayout';
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';
import tipebusService from '../../../services/mitra/tipebusService';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

export default function IndexTipeBus() {
    const [tipeBusList, setTipeBusList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Fetch Tipe Bus Data
    useEffect(() => {
        const loadTipeBus = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await tipebusService.fetchAllTipeByMitra();
                setTipeBusList(data || []);
            } catch (err) {
                setError(err.message);
                Swal.fire({
                    title: 'Error',
                    text: err.message || 'Gagal mengambil data tipe bus',
                    icon: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadTipeBus();
    }, []);

    // Logic Filter & Search
    const filteredTipeBus = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return tipeBusList.filter(item => {
            return (
                item.tipe?.toLowerCase().includes(searchLower)
            );
        });
    }, [searchTerm, tipeBusList]);

    const ActionButtons = ({ id }) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => navigate(`/mitra/tipe-bus/${id}`)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                title="Edit Tipe Bus"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(id)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md"
                title="Hapus Tipe Bus"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    const columns = [
        {
            data: 'tipe',
            title: 'Tipe Bus',
            width: '50%',
            render: (data) => `<span class="font-semibold text-slate-700">${data}</span>`
        },
        { data: 'kapasitas', title: 'Kapasitas', width: '35%', render: (data) => `<span>${data} kursi</span>` },
        {
            data: null,
            title: 'Aksi',
            orderable: false,
            className: 'text-center',
            width: '15%',
            defaultContent: '<div class="action-cell"></div>'
        }
    ];

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Tipe Bus?',
            text: "Data yang dihapus mungkin berpengaruh pada data bus!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await tipebusService.fetchDeleteTipeBus(id);
                    setTipeBusList(prev => prev.filter(t => t.idTipe !== id));
                    Swal.fire('Terhapus!', 'Data tipe bus berhasil dihapus.', 'success');
                } catch (error) {
                    Swal.fire('Gagal!', error.message || 'Gagal menghapus data tipe bus.', 'error');
                }
            }
        });
    };

    return (
        <StaffLayout>
            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-slate-600">Memuat data tipe bus...</p>
                        </div>
                    </div>
                ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-slate-100 flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-white">
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
                                    placeholder="Cari tipe bus..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all hover:bg-slate-100 hover:border-slate-300"
                                />
                            </div>
                        </div>

                        <Link
                            to="/mitra/tipe-bus/create"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all h-[42px]"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Tipe Bus
                        </Link>

                    </div>

                    <div className="p-0">
                        <DataTable
                            data={filteredTipeBus}
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
                                        root.render(<ActionButtons id={data.idTipe} />);
                                    }
                                }
                            }}
                        >
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-600">Tipe Bus</th>
                                    <th className="px-6 py-4 font-semibold text-slate-600">Kapasitas</th>
                                    <th className="px-6 py-4 font-semibold text-slate-600 text-center">Aksi</th>
                                </tr>
                            </thead>
                        </DataTable>
                    </div>
                </div>
                )}
            </div>
        </StaffLayout>
    );
}