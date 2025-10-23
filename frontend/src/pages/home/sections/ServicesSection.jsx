import React from 'react';
import { ShieldCheckIcon, TruckIcon, ClockIcon, ChatBubbleLeftRightIcon, WifiIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function LayananKami() {
    const services = [
        {
            id: 1,
            title: 'Transaksi Aman & Mudah',
            subtitle: 'Pembayaran 100% online dan terverifikasi.',
            description: 'Sistem pembayaran terverifikasi dengan pilihan transfer bank, e-wallet, hingga minimarket.',
            icon: ShieldCheckIcon,
            iconColor: 'text-blue-700'
        },
        {
            id: 2,
            title: 'Tepat Waktu',
            subtitle: 'Berangkat dan datang sesuai jadwal.',
            description: 'Komitmen kami adalah ketepatan waktu untuk setiap penumpang.',
            icon: ClockIcon,
            iconColor: 'text-blue-700'
        },
        {
            id: 3,
            title: 'Harga Terjangkau',
            subtitle: 'Kualitas tinggi dengan harga bersahabat.',
            description: 'Nikmati perjalanan nyaman tanpa harus menguras kantong Anda. Kami menawarkan tarif yang kompetitif dan transparan.',
            icon: BanknotesIcon,
            iconColor: 'text-blue-700'
        },
        {
            id: 4,
            title: 'Perjalanan Nyaman',
            subtitle: 'Armada bersih & tempat duduk nyaman.',
            description: 'Didesain untuk memberikan kenyamanan selama perjalanan Anda.',
            icon: TruckIcon,
            iconColor: 'text-blue-700'
        },
        {
            id: 5,
            title: 'Fasilitas Lengkap',
            subtitle: 'AC, WiFi, Charging Port & lebih banyak lagi.',
            description: 'AC, seat belt, charging port, dan fasilitas pendukung lainnya tersedia untuk kenyamanan maksimal Anda.',
            icon: WifiIcon,
            iconColor: 'text-blue-700'
        },
        {
            id: 6,
            title: 'Customer Support 24/7',
            subtitle: 'Bantuan kapan saja Anda butuhkan.',
            description: 'Tim customer service kami siap membantu melalui WhatsAp dan telepon setiap saat.',
            icon: ChatBubbleLeftRightIcon,
            iconColor: 'text-blue-700'
        },
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                        Layanan Kami
                    </h2>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => {
                        const IconComponent = service.icon;
                        return (
                            <div key={service.id}>
                                {/* Icon & Title Row */}
                                <div className="flex items-center gap-2 mb-2">
                                    <IconComponent className={`w-6 h-6 flex-shrink-0 ${service.iconColor}`} strokeWidth={1.5} />
                                    <h3 className="text-xl font-bold text-blue-700">
                                        {service.title}
                                    </h3>
                                </div>

                                {/* Subtitle */}
                                <p className="text-base font-semibold text-gray-900">
                                    {service.subtitle}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}