import { useState, useEffect } from "react";
import authService from "../../services/authService";
import tiketService from "../../services/tiketService";
import { Bus, CheckCircle, Clock, XCircle } from "lucide-react";

export default function TiketReservasi() {
    const [tiket, setTiket] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const renderStatusBadge = (status) => {
        const statusConfig = {
            paid: {
                label: "Paid",
                icon: <CheckCircle className="w-4 h-4 text-green-600" />,
                className: "bg-green-100 text-green-700 border-green-300",
            },
            pending: {
                label: "Pending",
                icon: <Clock className="w-4 h-4 text-yellow-600" />,
                className: "bg-yellow-100 text-yellow-700 border-yellow-300",
            },
            expired: {
                label: "Expired",
                icon: <XCircle className="w-4 h-4 text-red-600" />,
                className: "bg-red-100 text-red-700 border-red-300",
            },
        };

        const data = statusConfig[status] || statusConfig.pending;

        return (
            <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${data.className}`}
            >
                {data.icon}
                <span>{data.label}</span>
            </div>
        );
    };

    useEffect(() => {
        const loadTiket = async () => {
            try {
                const user = authService.getUser();
                const data = await tiketService.fetchTiketUser(user.idUser);

                if (Array.isArray(data)) {
                    setTiket(data);
                } else {
                    console.error("Data bukan array:", data);
                    setTiket([]);
                }
            } catch (err) {
                console.error("Error loading tiket:", err);
                setError("Gagal memuat data tiket");
            } finally {
                setLoading(false);
            }
        };

        loadTiket();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(tiket.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTiket = tiket.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {tiket.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md">
                    <div className="bg-blue-50 p-4 rounded-full mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 7h18M3 12h18M3 17h18"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Belum Ada Reservasi
                    </h3>

                    <p className="text-gray-600 max-w-sm text-center mb-6">
                        Lakukan pemesanan untuk melihat daftar tiket Anda.
                    </p>

                    <a
                        href="/reservasi"
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Pesan Tiket Sekarang
                    </a>
                </div>

            ) : (
                <>
                    {/* List Layout for Tickets */}
                    <div className="space-y-4 mb-8">
                        {currentTiket.map((item) => (
                            <div
                                key={item.idReservasi}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                            >
                                <div className="p-4">
                                    {/* Header - Booking ID and Status */}
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Booking ID</p>
                                            <p className="text-base font-semibold text-gray-800">{item.idReservasi}</p>
                                        </div>
                                        <div>
                                            {renderStatusBadge(item.status)}
                                        </div>
                                    </div>

                                    {/* Route with Icon */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <Bus size={20} className="text-blue-600" />

                                            <div className="flex items-center gap-2 flex-1">
                                                <span className="text-base font-semibold text-gray-800">
                                                    {item.jadwal.terminalNaik.nama}
                                                </span>

                                                <svg
                                                    className="w-5 h-5 text-blue-600 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>

                                                <span className="text-base font-semibold text-gray-800">
                                                    {item.jadwal.terminalTurun.nama}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Section */}
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600 font-medium">
                                            {new Date(item.jadwal.tanggal_keberangkatan).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                            {" - "}
                                            {new Date(item.jadwal.tanggal_keberangkatan)
                                                .toLocaleTimeString("id-ID", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })
                                                .replace(/\./g, ":")}{" "}
                                            WIB
                                        </p>

                                        <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded border-2 border-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                            Detail Tiket
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mb-1">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded ${currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                    } transition-colors duration-200`}
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded ${currentPage === page
                                        ? "bg-blue-600 text-white font-semibold"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                        } transition-colors duration-200`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded ${currentPage === totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                    } transition-colors duration-200`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
