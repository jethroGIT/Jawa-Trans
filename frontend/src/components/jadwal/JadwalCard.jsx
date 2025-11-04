import {
    AirVent,
    Wifi,
    Cctv,
    Armchair,
    Plus,
    ArrowRight,
} from "lucide-react";

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
                    {item.bus?.fasilitas.slice(0, 3).map((fasilitas, index) => {
                        let IconComponent;

                        switch (fasilitas.nama.toLowerCase()) {
                            case "ac":
                                IconComponent = AirVent;
                                break;
                            case "cctv":
                                IconComponent = Cctv;
                                break;
                            case "kursi luas":
                                IconComponent = Armchair;
                                break;
                            case "wifi":
                                IconComponent = Wifi;
                                break;
                            default:
                                IconComponent = Plus;
                                break;
                        }

                        return (
                            <div
                                key={index}
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center"
                            >
                                <IconComponent className="w-4 h-4 text-gray-600" />
                            </div>
                        );
                    })}

                    {/* Jika fasilitas lebih dari 3, tampilkan +n */}
                    {item.bus?.fasilitas.length > 3 && (
                        <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-600 text-sm">
                            +{item.bus.fasilitas.length - 3}
                        </div>
                    )}
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