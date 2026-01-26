import { useState, useEffect } from 'react';
import { AirVent, Cctv, Armchair, Wifi, Users } from 'lucide-react';

export default function MobilCard({ jadwal }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Akses foto dari struktur data: jadwal.bus.tipe_bus.foto_bus
    const fotos = jadwal?.bus?.tipe_bus?.foto_bus || [];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === fotos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? fotos.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Auto-play functionality
    useEffect(() => {
        if (fotos.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, fotos.length]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* FOTO CAROUSEL */}
            <div className="relative w-full">
                {/* Main Carousel */}
                <div className="relative w-full overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {fotos.length > 0 ? (
                            fotos.map((foto, index) => (
                                <div 
                                    key={foto.idFoto_Bus} 
                                    className="w-full flex-shrink-0"
                                >
                                    <div className="w-full h-52 bg-gray-100">
                                        <img
                                            src={foto.url}
                                            alt={`Bus ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-52 bg-gray-100 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs">Tidak ada foto</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {fotos.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                        >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                        >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Slide Indicator */}
                {fotos.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {fotos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentIndex 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white bg-opacity-50 hover:bg-opacity-80'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Slide Counter */}
                {fotos.length > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-0.5 rounded-full text-xs">
                        {currentIndex + 1} / {fotos.length}
                    </div>
                )}
            </div>

            {/* INFO MOBIL */}
            <div className="p-4">
                {/* Header Compact */}
                <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {jadwal?.bus?.tipe_bus?.mitra?.nama || "Nama Travel"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{jadwal?.bus?.tipe_bus?.tipe || "Jenis Mobil"}</p>
                </div>

                {/* Info Compact */}
                <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{jadwal?.bus?.tipe_bus?.kapasitas || "0"} Kursi</span>
                    </div>
                </div>

                {/* Fasilitas Grid */}
                <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Fasilitas
                    </h3>

                    {jadwal?.bus?.tipe_bus?.fasilitas && jadwal.bus.tipe_bus.fasilitas.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {jadwal.bus.tipe_bus.fasilitas.map((fasilitas, index) => {
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
        </div>
    );
}