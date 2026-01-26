import AdminLayout from '../../../layouts/AdminLayout';
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

import fasilitasService from '../../../services/admin/fasilitasService';

export default function IndexFasilitas() {
    const [fasilitas, setFasilitas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    // Fetch Data Fasilitas on mount
    useEffect(() => {
        const loadFasilitas = async () => {
            try {
                setIsLoading(true);
                const data = await fasilitasService.getAllFasilitas();

                // Transform data to match table format
                // Structure: idFasilitas, nama, created_at, updated_at
                const transformedData = data.map(item => ({
                    idFasilitas: item.idFasilitas,
                    nama: item.nama || '-',
                    created_at: item.created_at ? new Date(item.created_at).toLocaleString() : '-',
                    updated_at: item.updated_at ? new Date(item.updated_at).toLocaleString() : '-'
                }));

                setFasilitas(transformedData);
            } catch (error) {
                console.error('Error loading fasilitas:', error);
                Swal.fire('Error', error.message, 'error');
                setFasilitas([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadFasilitas();
    }, []);

    // Filter logic
    const filteredFasilitas = useMemo(() => {
        return fasilitas.filter((item) => {
            const lowerSearch = searchTerm.toLowerCase();
            return (
                item.nama.toLowerCase().includes(lowerSearch)
            );
        });
    }, [searchTerm, fasilitas]);

    const ActionButtons = ({ id }) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => navigate(`/admin/fasilitas/${id}`)}
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

    const columns = [
        {
            data: 'nama',
            title: 'Nama Fasilitas',
            render: (data) => `<span class="font-bold text-slate-900 tracking-wide">${data}</span>`
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
            title: 'Hapus Fasilitas?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fasilitasService.fetchDeleteFasilitas(id);
                    setFasilitas(prev => prev.filter(item => item.idFasilitas !== id));
                    Swal.fire('Terhapus!', 'Data fasilitas berhasil dihapus.', 'success');
                } catch (error) {
                    Swal.fire('Gagal', error.message || 'Gagal menghapus data', 'error');
                }
            }
        });
    };

    return (
        <AdminLayout>
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
                                        placeholder="Cari fasilitas..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all hover:bg-slate-100 hover:border-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/admin/fasilitas/create"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all h-[42px] flex-shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Fasilitas
                        </Link>
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                                <p>Memuat data fasilitas...</p>
                            </div>
                        ) : fasilitas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <p>Tidak ada data fasilitas</p>
                            </div>
                        ) : (
                            <DataTable
                                data={filteredFasilitas}
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
                                            root.render(<ActionButtons id={data.idFasilitas} />);
                                        }
                                    }
                                }}
                            >
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Nama Fasilitas</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Aksi</th>
                                    </tr>
                                </thead>
                            </DataTable>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
