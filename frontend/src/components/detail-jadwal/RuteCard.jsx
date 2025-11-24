// components/detail-jadwal/RuteCard.jsx
export default function RuteCard({ jadwal }) {
    // Helper function untuk format tanggal
    const formatTanggal = (tanggal) => {
        if (!tanggal) return "-";
        const date = new Date(tanggal);
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('id-ID', options);
    };

    // Helper function untuk format jam
    const formatJam = (jamISO) => {
        if (!jamISO) return "--:--";
        const date = new Date(jamISO);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Helper function untuk hitung estimasi waktu
    const hitungEstimasi = (jamBerangkat, jamTiba) => {
        if (!jamBerangkat || !jamTiba) return "--:--";

        const berangkat = new Date(jamBerangkat);
        const tiba = new Date(jamTiba);
        const diff = tiba - berangkat;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}j ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const estimasiWaktu = hitungEstimasi(
        jadwal?.jam_keberangkatan,
        jadwal?.jam_kedatangan
    );

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Rute Perjalanan</h2>

            {/* Timeline */}
            <div className="flex items-start justify-between mb-2">
                {/* Keberangkatan */}
                <div className="flex-1">
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                            <div className="w-0.5 h-16 bg-blue-200 mt-1"></div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Berangkat</div>
                            <div className="font-semibold text-gray-900">
                                {formatJam(jadwal?.jam_keberangkatan)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {formatTanggal(jadwal?.tanggal_keberangkatan)}
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        {jadwal?.terminalNaik?.nama || "Terminal Keberangkatan"}
                    </div>
                </div>

                {/* Estimasi */}
                <div className="flex flex-col items-center mx-4 pt-1">
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mb-2">
                        {estimasiWaktu}
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>

                {/* Kedatangan */}
                <div className="flex-1 text-right">
                    <div className="flex items-start justify-end gap-3">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Tiba</div>
                            <div className="font-semibold text-gray-900">
                                {formatJam(jadwal?.jam_kedatangan)}
                            </div>

                            <div className="text-xs text-gray-400 mt-1">
                                {formatTanggal(jadwal?.tanggal_kedatangan)}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                            <div className="w-0.5 h-16 bg-green-200 mt-1"></div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        {jadwal?.terminalTurun?.nama || "Terminal Tujuan"}
                    </div>
                </div>
            </div>
        </div>
    );
}