// components/JadwalCard.jsx
export default function JadwalCard({ item }) {
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const calculateDuration = (departure, arrival) => {
        const start = new Date(departure);
        const end = new Date(arrival);
        const diffMs = end - start;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} Jam ${minutes} Menit`;
    };

    const duration = calculateDuration(item.jam_keberangkatan, item.jam_kedatangan);

    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 p-6">
            {/* Row 1 - Bus Info */}
            <div className="mb-1">
                <h3 className="text-lg font-bold text-gray-900">
                    {item.bus?.nama}
                </h3>
                <p className="text-sm text-gray-500">
                    {item.bus?.type}
                </p>
            </div>

            {/* Row 2 - Time, Duration, Facilities, Price */}
            <div className="flex items-center gap-10">
                {/* Time Section */}
                <div className="flex items-center gap-6">
                    {/* Departure */}
                    <div className="w-24">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatTime(item.jam_keberangkatan)}
                        </div>
                        <div className="text-xs text-gray-500 line-camp">
                            {item.terminalNaik?.nama}
                        </div>
                    </div>

                    {/* Arrow */}
                    <svg className="w-6 h-6 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>

                    {/* Arrival */}
                    <div className="w-24">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatTime(item.jam_kedatangan)}
                        </div>
                        <div className="text-xs text-gray-500 line-camp">
                            {item.terminalTurun?.nama}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-16 bg-gray-200"></div>

                {/* Duration */}
                <div className="text-center">
                    <div className="text-base font-medium text-gray-900">
                        Estimasi
                    </div>
                    <div className="text-base font-medium text-gray-900">
                        {duration}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-16 bg-gray-200"></div>

                {/* Facilities Icons */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <span className="text-sm text-gray-600 ml-1">+ {item.bus?.kapasitas - 3}</span>
                </div>

                {/* Right Section - Price & Button */}
                <div className="flex flex-col items-end gap-1 ml-auto">
                    <div className="text-right">
                        <span className="text-2xl font-bold text-orange-600">
                            Rp {parseInt(item.harga).toLocaleString('id-ID')}
                        </span>
                        <span className="text-1xs text-gray-400 ml-1">/kursi</span>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full py-2.5 rounded-lg transition-colors duration-200">
                        Pilih
                    </button>
                </div>
            </div>
        </div>
    );
}