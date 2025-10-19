import React from 'react';

// Import logos (gunakan path sesuai struktur project Anda)
import bca from "../../../assets/Pembayaran/bca.png";
import bri from "../../../assets/Pembayaran/bri.png";
import bni from "../../../assets/Pembayaran/bni.png";
import mandiri from "../../../assets/Pembayaran/mandiri.png";
import alfamart from "../../../assets/Pembayaran/alfamart.png";
import indomaret from "../../../assets/Pembayaran/indomaret.png";
import oripay from "../../../assets/Pembayaran/oripay.png";
import ovo from "../../../assets/Pembayaran/ovo.png";
import gopay from "../../../assets/Pembayaran/gopay.png";
import dana from "../../../assets/Pembayaran/dana.png";
import seabank from "../../../assets/Pembayaran/seabank.png";
import superbank from "../../../assets/Pembayaran/superbank.png";

export default function PaymentPartners() {
    const firstRowLogos = [
        { name: 'BCA', logo: bca },
        { name: 'Mandiri', logo: mandiri },
        { name: 'BNI', logo: bni },
        { name: 'BRI', logo: bri },
    ];

    const secondRowLogos = [
        { name: 'Oripay', logo: oripay },
        { name: 'OVO', logo: ovo },
        { name: 'GoPay', logo: gopay },
        { name: 'DANA', logo: dana }
    ];

    const thirdRowLogos = [
        { name: 'Alfamart', logo: alfamart },
        { name: 'Indomaret', logo: indomaret },
        { name: 'Seabank', logo: seabank },
        { name: 'Superbank', logo: superbank }
    ];

    return (
        <section className="py-12 bg-white border-t border-gray-200">
            <div className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">

                    {/* Left side content */}
                    <div className="md:w-2/5">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Partner Pembayaran
                        </h2>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Jadikan Pembayaran Lebih Mudah
                        </h3>
                        <p className="text-base text-gray-600 leading-relaxed">
                            Kami bekerja sama dengan bank dan mini market tepercaya untuk kenyamanan pembayaran Anda.
                        </p>
                    </div>

                    {/* Logos */}
                    <div className="md:w-3/5">
                        <div className="flex items-center gap-x-8 gap-y-6 mb-3">
                            {firstRowLogos.map((partner) => (
                                <div key={partner.name} className="flex items-center justify-center w-28 h-12">
                                    <img
                                        key={partner.name}
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-12 max-w-full w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-x-8 gap-y-6 mb-3">
                            {secondRowLogos.map((partner) => (
                                <div key={partner.name} className="flex items-center justify-center w-28 h-12">
                                    <img
                                        key={partner.name}
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-12 max-w-full w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-x-8 gap-y-6">
                            {thirdRowLogos.map((partner) => (
                                <div key={partner.name} className="flex items-center justify-center w-28 h-12">
                                    <img
                                        key={partner.name}
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-12 max-w-full w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}