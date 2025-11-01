// components/jadwal/JadwalHeader.jsx
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function JadwalHeader({ asal, tujuan, tanggal, jumlahPenumpang, onChangeSearch }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Pilih Tanggal';
        const date = new Date(dateString);
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);

        return `${dayName}, ${day} ${month} ${year}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-3.5 py-3.5 mb-6">
            <div className="flex items-center justify-between">
                {/* Left Section - Search Info */}
                <div className="flex items-center gap-3 flex-1 justify-start">
                    {/* Search Icon */}
                    <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />

                    {/* Route */}
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-900">
                            {asal || 'Asal'}
                        </span>
                        <svg className="w-6 h-6 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="text-lg font-semibold text-gray-900">
                            {tujuan || 'Tujuan'}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-gray-200"></div>

                    {/* Date */}
                    <span className="text-base font-medium text-gray-700">
                        {formatDate(tanggal)}
                    </span>

                    {/* Divider */}
                    <div className="w-px h-8 bg-gray-200"></div>

                    {/* Passengers */}
                    <span className="text-base font-medium text-gray-700">
                        {jumlahPenumpang || '1'} Kursi
                    </span>
                </div>

                {/* Right Section - Change Button */}
                {onChangeSearch && (
                    <button
                        onClick={onChangeSearch}
                        className="ml-auto bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-8 py-2.5 rounded-xl transition-colors duration-200 text-sm ml-4"
                    >
                        Cari
                    </button>
                )}
            </div>
        </div>
    );
}