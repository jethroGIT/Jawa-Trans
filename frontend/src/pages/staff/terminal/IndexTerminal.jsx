import StaffLayout from '../../../layouts/StaffLayout';
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Filter, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

const DUMMY_TERMINAL = [
    { idTerminal: 1, kota: 'Yogyakarta', nama: 'Terminal Giwangan' },
    { idTerminal: 2, kota: 'Surakarta', nama: 'Terminal Tirtonadi' },
    { idTerminal: 3, kota: 'Surabaya', nama: 'Terminal Bungurasih' },
    { idTerminal: 4, kota: 'Jakarta Timur', nama: 'Terminal Pulo Gebang' },
    { idTerminal: 5, kota: 'Bandung', nama: 'Terminal Cicaheum' },
    { idTerminal: 6, kota: 'Malang', nama: 'Terminal Arjosari' },
    { idTerminal: 7, kota: 'Semarang', nama: 'Terminal Terboyo' },
    { idTerminal: 8, kota: 'Denpasar', nama: 'Terminal Mengwi' },
    { idTerminal: 9, kota: 'Yogyakarta', nama: 'Terminal Jombor' },
    { idTerminal: 1, kota: 'Yogyakarta', nama: 'Terminal Giwangan' },
    { idTerminal: 2, kota: 'Surakarta', nama: 'Terminal Tirtonadi' },
    { idTerminal: 3, kota: 'Surabaya', nama: 'Terminal Bungurasih' },
    { idTerminal: 4, kota: 'Jakarta Timur', nama: 'Terminal Pulo Gebang' },
    { idTerminal: 5, kota: 'Bandung', nama: 'Terminal Cicaheum' },
    { idTerminal: 6, kota: 'Malang', nama: 'Terminal Arjosari' },
    { idTerminal: 7, kota: 'Semarang', nama: 'Terminal Terboyo' },
    { idTerminal: 8, kota: 'Denpasar', nama: 'Terminal Mengwi' },
    { idTerminal: 9, kota: 'Yogyakarta', nama: 'Terminal Jombor' },
    
];

export default function IndexTerminal() {
    const [terminals, setTerminals] = useState(DUMMY_TERMINAL);
    const [selectedKota, setSelectedKota] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    // List Kota Unik
    const uniqueCities = useMemo(() => {
        return [...new Set(terminals.map(item => item.kota))].sort();
    }, [terminals]);

    // Logic Filter & Search
    const filteredTerminals = useMemo(() => {
        return terminals.filter(item => {
            const matchKota = selectedKota ? item.kota === selectedKota : true;
            const searchLower = searchTerm.toLowerCase();
            const matchSearch =
                item.nama.toLowerCase().includes(searchLower) ||
                item.kota.toLowerCase().includes(searchLower);
            return matchKota && matchSearch;
        });
    }, [selectedKota, searchTerm, terminals]);

    const ActionButtons = ({ id }) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => navigate(`/mitra/terminal/${id}`)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                title="Edit Terminal"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(id)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md"
                title="Hapus Terminal"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    const columns = [
        { data: 'kota', title: 'Kota / Lokasi', width: '25%' },
        {
            data: 'nama',
            title: 'Nama Terminal',
            width: '50%',
            render: (data) => `<span class="font-semibold text-slate-700">${data}</span>`
        },
        {
            data: null,
            title: 'Aksi',
            orderable: false,
            className: 'text-center',
            width: '25%',
            defaultContent: '<div class="action-cell"></div>'
        }
    ];

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Terminal?',
            text: "Data yang dihapus mungkin berpengaruh pada jadwal!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus'
        }).then((result) => {
            if (result.isConfirmed) {
                setTerminals(prev => prev.filter(t => t.idTerminal !== id));
                Swal.fire('Terhapus!', 'Data terminal berhasil dihapus.', 'success');
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
                                        placeholder="Cari terminal..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all hover:bg-slate-100 hover:border-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-52 group">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Filter Kota</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Filter className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={selectedKota}
                                        onChange={(e) => setSelectedKota(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-slate-100 hover:border-slate-300"
                                    >
                                        <option value="">Semua Kota</option>
                                        {uniqueCities.map(kota => (
                                            <option key={kota} value={kota}>{kota}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4" /></svg>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <Link
                            to="/mitra/terminal/create"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all h-[42px]"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Terminal
                        </Link>

                    </div>

                    <div className="p-0">
                        <DataTable
                            data={filteredTerminals}
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
                                        root.render(<ActionButtons id={data.idTerminal} />);
                                    }
                                }
                            }}
                        >
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-600">Kota / Lokasi</th>
                                    <th className="px-6 py-4 font-semibold text-slate-600">Nama Terminal</th>
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