import SuperAdminLayout from '../../../layouts/SuperAdminLayout';
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Loader2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

import rolesService from '../../../services/superadmin/rolesService';

export default function IndexRoles() {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({ nama: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setIsLoading(true);
            const data = await rolesService.getAllRoles();

            const transformed = data.map(r => ({
                idRole: r.idRole,
                nama: r.nama || '-'
            }));

            setRoles(transformed);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = useMemo(() => {
        return roles.filter((r) => {
            const q = searchTerm.toLowerCase();
            return r.nama.toLowerCase().includes(q);
        });
    }, [searchTerm, roles]);

    const handleOpenCreateModal = () => {
        setFormData({ nama: '' });
        setShowCreateModal(true);
    };

    const handleOpenUpdateModal = (role) => {
        setSelectedRole(role);
        setFormData({ nama: role.nama });
        setShowUpdateModal(true);
    };

    const handleCloseModals = () => {
        setShowCreateModal(false);
        setShowUpdateModal(false);
        setSelectedRole(null);
        setFormData({ nama: '' });
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();

        if (!formData.nama.trim()) {
            Swal.fire({
                title: 'Validasi Error',
                text: 'Nama role harus diisi',
                icon: 'error'
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await rolesService.createRole({ nama: formData.nama.trim() });

            Swal.fire({
                title: 'Berhasil!',
                text: 'Role berhasil ditambahkan',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            handleCloseModals();
            loadRoles();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateRole = async (e) => {
        e.preventDefault();

        if (!formData.nama.trim()) {
            Swal.fire({
                title: 'Validasi Error',
                text: 'Nama role harus diisi',
                icon: 'error'
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await rolesService.updateRole(selectedRole.idRole, { nama: formData.nama.trim() });

            Swal.fire({
                title: 'Berhasil!',
                text: 'Role berhasil diperbarui',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            handleCloseModals();
            loadRoles();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (role) => {
        Swal.fire({
            title: 'Hapus Role?',
            text: `Apakah Anda yakin ingin menghapus role "${role.nama}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await rolesService.deleteRole(role.idRole);

                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Role berhasil dihapus',
                        icon: 'success',
                        timer: 2000
                    });

                    loadRoles();
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };

    const ActionButtons = ({ role }) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => handleOpenUpdateModal(role)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md"
                title="Edit Role"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(role)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md"
                title="Hapus Role"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    const columns = [
        {
            data: 'nama',
            title: 'Nama Role',
            render: (d) => `<span class="font-bold text-slate-900 tracking-wide">${d}</span>`
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
        <SuperAdminLayout>
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
                                        placeholder="Cari role..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all hover:bg-slate-100 hover:border-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenCreateModal}
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all h-[42px] flex-shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Role
                        </button>
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                                <p>Memuat data role...</p>
                            </div>
                        ) : roles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                                <p>Tidak ada data role</p>
                            </div>
                        ) : (
                            <DataTable
                                data={filtered}
                                columns={columns}
                                className="display w-full text-left border-collapse"
                                options={{
                                    responsive: true,
                                    destroy: true,
                                    searching: false,
                                    paging: true,
                                    lengthMenu: [[5, 10, 20, 50, -1], [5, 10, 20, 50, "Semua"]],
                                    pageLength: 10,
                                    dom: 'tr<"flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4"lip>',
                                    language: {
                                        lengthMenu: "_MENU_",
                                        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                                        infoEmpty: "Tidak ada data",
                                        zeroRecords: "Pencarian tidak ditemukan",
                                        paginate: { next: "Next", previous: "Prev" }
                                    },
                                    createdRow: (row, data) => {
                                        const actionCell = row.querySelector('.action-cell');
                                        if (actionCell) {
                                            const root = createRoot(actionCell);
                                            root.render(<ActionButtons role={data} />);
                                        }
                                    }
                                }}
                            >
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Nama Role</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Aksi</th>
                                    </tr>
                                </thead>
                            </DataTable>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">Tambah Role Baru</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateRole}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Nama Role <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nama}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        placeholder="Masukkan nama role"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <button
                                    type="button"
                                    onClick={handleCloseModals}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">Edit Role</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateRole}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Nama Role <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nama}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        placeholder="Masukkan nama role"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <button
                                    type="button"
                                    onClick={handleCloseModals}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSubmitting ? 'Memperbarui...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}