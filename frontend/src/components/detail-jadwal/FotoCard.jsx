// components/detail-jadwal/FotoCard.jsx
import { useState, useEffect } from 'react';

export default function FotoCard({ jadwal }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const fotos = jadwal?.bus?.foto_bus || [];

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

    if (fotos.length === 0) {
        return (
            <div className="w-full bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg">Tidak ada foto tersedia</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Carousel Container */}
            <div className="relative w-full">
                {/* Main Carousel */}
                <div className="relative w-full overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {fotos.map((foto, index) => (
                            <div 
                                key={foto.idFoto_Bus} 
                                className="w-full flex-shrink-0"
                            >
                                {/* UBAH aspect-video menjadi aspect ratio yang lebih kecil */}
                                <div className="w-full h-96 bg-gray-100">
                                    {/* ATAU gunakan tinggi tetap: */}
                                    {/* <div className="w-full h-96 bg-gray-100"> */}
                                    
                                    <img
                                        src={foto.url}
                                        alt={`Bus ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {fotos.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Slide Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {fotos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? 'bg-white scale-125' 
                                    : 'bg-white bg-opacity-50 hover:bg-opacity-80'
                            }`}
                        />
                    ))}
                </div>

                {/* Slide Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} / {fotos.length}
                </div>
            </div>
        </div>
    );
}