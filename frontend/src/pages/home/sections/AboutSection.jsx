import React from 'react';

// Import logos (gunakan path sesuai struktur project Anda)
import jawatrans from "../../../assets/CL/banner-master.png";

export default function PaymentPartners() {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">

                    {/* Left side content */}
                    <div className="md:w-2/5">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Pesan Tiket Bus Travel Online di Jawa Trans
                        </h2>
                        <p className="text-base text-gray-600 leading-relaxed">
                            Pesan tiket bus online dan travel semudah belanja online tanpa perlu ke agen tiket bus. Jadwal bus travel, trayek, tempat keberangkatan, fasilitas, harga tiket, hingga pilih kursi hanya di Jawa Trans.
                        </p>
                    </div>

                    {/* Logos */}
                    <div className="md:w-3/5">
                        <div className="flex items-center justify-center gap-x-8 gap-y-6 mb-3">
                            <div key='jawatrans' className="flex">
                                <img
                                    key='jawatrans'
                                    src={jawatrans}
                                    alt='jawatrans'
                                    className="h-40 w-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}