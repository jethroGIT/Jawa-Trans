import StaffLayout from '../../../layouts/StaffLayout';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Bus, User, Armchair, CreditCard, Loader2, X, Users, Wifi, Info, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import daftarPenumpangService from '../../../services/mitra/daftarPenumpangService';
import { createRoot } from 'react-dom/client';

// --- DATATABLES IMPORTS ---
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

export default function DetailJadwalPenumpang() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [jadwal, setJadwal] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await daftarPenumpangService.fetchDaftarPenumpangById(id);

                if (data.jadwal) {
                    setJadwal(data.jadwal);
                }

                if (data.reservasi) {
                    setReservations(data.reservasi);
                }

            } catch (error) {
                console.error('Error loading detail:', error);
                Swal.fire('Error', 'Gagal memuat data detail penumpang', 'error');
                navigate('/mitra/daftar-penumpang');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id, navigate]);

    const handleViewPassengers = (reservation) => {
        setSelectedReservation(reservation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReservation(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':');
        } catch (e) {
            return '-';
        }
    };


    const getStatusBadge = (status) => {
        const styles = {
            paid: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            failed: 'bg-red-100 text-red-800 border-red-200'
        };

        const label = status ? status.toUpperCase() : 'UNKNOWN';
        const style = styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';

        return `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}">${label}</span>`;
    };

    // Component for Action Buttons inside React Root
    const ActionButtons = ({ reservation }) => (
        <div className="flex items-center justify-center">
            <button
                onClick={() => handleViewPassengers(reservation)}
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md mx-auto"
            >
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Lihat Penumpang</span>
            </button>
        </div>
    );

    const columns = [
        {
            data: null,
            title: 'No',
            render: (data, type, row, meta) => meta.row + 1
        },
        {
            data: 'user.nama',
            title: 'Nama Pemesan',
            render: (data) => `<div class="font-medium text-slate-800">${data || 'Non-Member'}</div>`
        },
        {
            data: 'user.telephone',
            title: 'Kontak',
            render: (data) => data || '-'
        },
        {
            data: 'penumpang',
            title: 'Jumlah Kursi',
            className: 'text-center',
            render: (data) => `<span class="font-bold text-blue-600">${data}</span>`
        },
        {
            data: 'totalHarga',
            title: 'Total Harga',
            render: (data) => `Rp ${parseInt(data).toLocaleString('id-ID')}`
        },
        {
            data: 'status',
            title: 'Status',
            render: (data) => getStatusBadge(data)
        },
        {
            data: null,
            title: 'Aksi',
            orderable: false,
            className: 'text-center',
            defaultContent: '<div class="action-cell"></div>'
        }
    ];

    // Total Seats Sold Calculation
    const totalSeatsSold = reservations.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.penumpang : 0), 0);

    if (isLoading) {
        return (
            <StaffLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Memuat data...</p>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/mitra/daftar-penumpang')}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Detail Pemesanan</h1>
                        <p className="text-slate-500 text-sm">Informasi perjalanan dan daftar pemesan</p>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Route Info */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 flex flex-col justify-center items-center h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Bus className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Armada Bus</p>
                                <h3 className="font-bold text-lg">{jadwal?.bus?.kode_bus || '-'}</h3>
                            </div>
                        </div>

                        <div className="space-y-4 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[11px] top-3 bottom-0 w-0.5 bg-blue-400/50 h-16"></div>

                            <div className="flex gap-4 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-blue-100 text-xs">Keberangkatan</p>
                                    <p className="font-semibold">{jadwal?.terminalNaik?.nama || '-'}</p>
                                    <p className="text-blue-200 text-xs mt-0.5">{formatTime(jadwal?.jam_keberangkatan)} WIB</p>
                                </div>
                            </div>

                            <div className="flex gap-4 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-300 flex items-center justify-center shrink-0">
                                    <MapPin className="w-3 h-3 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-blue-100 text-xs">Tujuan</p>
                                    <p className="font-semibold">{jadwal?.terminalTurun?.nama || '-'}</p>
                                    <p className="text-blue-200 text-xs mt-0.5">{formatTime(jadwal?.jam_kedatangan)} WIB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Details */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">Tanggal</span>
                                    </div>
                                    <p className="font-medium text-slate-800 text-lg">
                                        {formatDate(jadwal?.tanggal_keberangkatan)}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Armchair className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">Ketersediaan Kursi</span>
                                    </div>
                                    <p className="font-medium text-slate-800 text-lg">
                                        <span className="text-green-600 font-bold">{jadwal?.kursiTersedia || 0}</span>
                                        <span className="text-slate-400 mx-1">/</span>
                                        {jadwal?.bus?.tipe_bus?.kapasitas || 0}
                                        <span className="text-sm text-slate-500 font-normal ml-1">Kursi</span>
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">Harga Tiket</span>
                                    </div>
                                    <p className="font-medium text-slate-800 text-lg">
                                        Rp {parseInt(jadwal?.harga || 0).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Extra Bus Info */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                Informasi Armada
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                        <span className="text-slate-500 text-sm">Operator</span>
                                        <span className="font-medium text-slate-800">{jadwal?.bus?.tipe_bus?.mitra?.nama || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                        <span className="text-slate-500 text-sm">Kelas Bus</span>
                                        <span className="font-medium text-slate-800">{jadwal?.bus?.tipe_bus?.tipe || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                        <span className="text-slate-500 text-sm">Plat Nomor</span>
                                        <span className="font-medium text-slate-800">{jadwal?.bus?.plat_nomor || '-'}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-3">Fasilitas:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {jadwal?.bus?.tipe_bus?.fasilitas && jadwal.bus.tipe_bus.fasilitas.length > 0 ? (
                                            jadwal.bus.tipe_bus.fasilitas.map((fasilitas, idx) => (
                                                <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {fasilitas.nama}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 text-sm italic">Tidak ada info fasilitas</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Reservations List */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Daftar Pemesan</h2>
                    </div>
                    <div className="p-0">
                        {reservations.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>Belum ada pemesanan untuk jadwal ini.</p>
                            </div>
                        ) : (
                            <DataTable
                                data={reservations}
                                columns={columns}
                                className="display w-full text-left border-collapse"
                                options={{
                                    responsive: true,
                                    destroy: true,
                                    searching: true,
                                    paging: true,
                                    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Semua"]],
                                    pageLength: 10,
                                    dom: 'tr<"flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4"lip>',
                                    language: {
                                        search: "",
                                        searchPlaceholder: "Cari pemesan...",
                                        lengthMenu: "_MENU_",
                                        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ pemesan",
                                        infoEmpty: "Tidak ada data",
                                        infoFiltered: "(disaring dari _MAX_ total data)",
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
                                            root.render(<ActionButtons reservation={data} />);
                                        }
                                    }
                                }}
                            >
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600 w-16">No</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Nama Pemesan</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Kontak</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Jumlah Kursi</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Total Harga</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-center">Aksi</th>
                                    </tr>
                                </thead>
                            </DataTable>
                        )}
                    </div>
                </div>
            </div>

            {/* Passenger Modal */}
            {
                isModalOpen && selectedReservation && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-up">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Detail Penumpang</h3>
                                    <p className="text-sm text-slate-500">Pemesan: <span className="font-semibold text-slate-700">{selectedReservation.user?.nama || 'Non-Member'}</span></p>
                                </div>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-0 overflow-y-auto max-h-[60vh]">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-600 w-16">No</th>
                                            <th className="px-6 py-4 font-semibold text-slate-600">Nama Penumpang</th>
                                            <th className="px-6 py-4 font-semibold text-slate-600">Nomor Kursi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {selectedReservation.reservasi_detail.map((detail, index) => (
                                            <tr key={detail.idDetail} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                                                <td className="px-6 py-4 font-medium text-slate-800">{detail.namaPenumpang}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-bold text-xs">
                                                        {detail.kursi?.noKursi || '-'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </StaffLayout>
    );
}
