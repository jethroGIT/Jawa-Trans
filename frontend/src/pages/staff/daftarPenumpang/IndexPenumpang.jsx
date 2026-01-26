import StaffLayout from '../../../layouts/StaffLayout';
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Loader2, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';
import daftarPenumpangService from '../../../services/mitra/daftarPenumpangService';
import authService from '../../../services/authService';

// --- DATATABLES IMPORTS ---
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

export default function IndexPenumpang() {
    const [jadwals, setJadwals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE FILTER & SEARCH ---
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    // Fetch Jadwal by Mitra on mount
    useEffect(() => {
        const loadJadwal = async () => {
            try {
                setIsLoading(true);
                const user = authService.getUser();

                if (!user?.idMitra) {
                    throw new Error('ID Mitra tidak ditemukan');
                }

                const data = await daftarPenumpangService.fetchDaftarPenumpangByMitra(user.idMitra);

                // Transform data to match table format
                const transformedData = data.map(jadwal => ({
                    idJadwal: jadwal.idJadwal,
                    kodeBus: jadwal.bus?.kode_bus || '-',
                    terminalNaik: jadwal.terminalNaik?.nama || '-',
                    terminalTurun: jadwal.terminalTurun?.nama || '-',
                    tanggal: jadwal.tanggal_keberangkatan
                }));

                setJadwals(transformedData);
            } catch (error) {
                console.error('Error loading jadwal:', error);
                Swal.fire('Error', 'Gagal memuat data jadwal', 'error');
                setJadwals([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadJadwal();
    }, []);

    // --- LOGIKA FILTER UTAMA ---
    const filteredData = useMemo(() => {
        return jadwals.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            const matchSearch =
                item.kodeBus.toLowerCase().includes(searchLower) ||
                item.terminalNaik.toLowerCase().includes(searchLower) ||
                item.terminalTurun.toLowerCase().includes(searchLower);

            return matchSearch;
        });
    }, [jadwals, searchTerm]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Komponen Tombol Aksi (React)
    const ActionButtons = ({ id }) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => navigate(`/mitra/daftar-penumpang/${id}`)}
                className="group flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                title="Lihat Daftar Penumpang"
            >
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Lihat Penumpang</span>
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
                        </div>
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                                <p>Memuat data jadwal...</p>
                            </div>
                        ) : jadwals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <p>Tidak ada data jadwal</p>
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
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
