import { useState } from 'react';
import jadwalService from '../../../services/jadwalService';

export default function HeroSection() {
    const [tripType, setTripType] = useState('sekali-jalan');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);

    const handleSearch = async () => {
        console.log('Tombol diklik, memanggil API...');
        console.log({ tripType, from, to, date, passengers });
        
        try {
            const response = await jadwalService.getAllJadwal();
            console.log('Response dari API:', response);
            alert('Berhasil! Lihat console untuk response data');
        } catch (err) {
            console.error('Error:', err);
            alert('Error! Lihat console untuk detail error');
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center flex items-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Text */}
                    <div className="text-white">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Yuk, cari tiket bus dan travel terbaik untuk kebutuhanmu.
                        </h1>
                        <p className="text-xl text-gray-200">
                            Layanan transportasi terbaik untuk perjalanan Anda
                        </p>
                    </div>

                    {/* Right Side - Search Form */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md ml-auto">
                        {/* Trip Type Tabs */}
                        <div className="flex border-b mb-4">
                            <button
                                onClick={() => setTripType('sekali-jalan')}
                                className={`flex-1 py-2 px-3 text-center text-sm font-semibold transition ${tripType === 'sekali-jalan'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Sekali jalan
                            </button>
                            <button
                                onClick={() => setTripType('pulang-pergi')}
                                className={`flex-1 py-2 px-3 text-center text-sm font-semibold transition ${tripType === 'pulang-pergi'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Pulang pergi
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-3">
                            {/* From and To - Side by Side */}
                            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
                                {/* From */}
                                <div>
                                    <label className="flex items-center text-gray-600 text-xs mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Dari
                                    </label>
                                    <input
                                        type="text"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        placeholder="Bandung"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Swap Button */}
                                <button
                                    type="button"
                                    className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition mb-0.5"
                                    onClick={() => {
                                        const temp = from;
                                        setFrom(to);
                                        setTo(temp);
                                    }}
                                >
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </button>

                                {/* To */}
                                <div>
                                    <label className="flex items-center text-gray-600 text-xs mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Ke
                                    </label>
                                    <input
                                        type="text"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        placeholder="Jakarta"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Date and Passengers - Side by Side */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Date */}
                                <div>
                                    <label className="flex items-center text-gray-600 text-xs mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Passengers */}
                                <div>
                                    <label className="flex items-center text-gray-600 text-xs mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Penumpang
                                    </label>
                                    <input
                                        type="number"
                                        value={passengers}
                                        onChange={(e) => setPassengers(e.target.value)}
                                        min="1"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                            >
                                Cari bus dan travel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}