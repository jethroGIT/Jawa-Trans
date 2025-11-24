import { AirVent, Cctv, Armchair, Wifi, Users } from 'lucide-react';

export default function MobilCard({ jadwal }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            {/* Header Compact */}
            <div className="mb-3">
                <h2 className="ext-lg font-semibold text-gray-900">
                    {jadwal?.bus?.mitra?.nama || "Nama Travel"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{jadwal?.bus?.type || "Jenis Mobil"}</p>
            </div>

            {/* Info Compact */}
            <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{jadwal?.bus?.kapasitas || "0"} Kursi</span>
                </div>
            </div>

            {/* Fasilitas Grid */}
            <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Fasilitas
                </h3>
                
                {jadwal?.bus?.fasilitas && jadwal.bus.fasilitas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {jadwal.bus.fasilitas.map((fasilitas, index) => {
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
                                    IconComponent = AirVent;
                            }

                            return (
                                <div
                                    key={fasilitas.idFasilitas || index}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                                    title={fasilitas.nama}
                                >
                                    <IconComponent className="w-3 h-3 text-gray-600" />
                                    <span className="text-xs text-gray-700 font-medium">
                                        {fasilitas.nama}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400 text-xs">Tidak ada fasilitas</p>
                )}
            </div>
        </div>
    );
}