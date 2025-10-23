import React from 'react';

// Import logos (gunakan path sesuai struktur project Anda)
import damri from "../../../assets/Travel/damri.png";
import pasteur from "../../../assets/Travel/pasteur.png";
import cititrans from "../../../assets/Travel/cititrans.jpeg";
import id90 from "../../../assets/Travel/id90.png";
import primajasa from "../../../assets/Travel/primajasa.jpeg";
import rosin from "../../../assets/Travel/rosin.png";
import jackal from "../../../assets/Travel/jackal.png";
import arnes from "../../../assets/Travel/arnes.jpeg";
import daytrans from "../../../assets/Travel/daytrans.png";
import xtrans from "../../../assets/Travel/xtrans.png";
import aragon from "../../../assets/Travel/aragon.png";
import lintas from "../../../assets/Travel/lintas.png";

export default function PaymentPartners() {
    const firstRowLogos = [
        { name: 'Damri', logo: damri },
        { name: 'ID90', logo: id90 },
        { name: 'Cititrans', logo: cititrans },
        { name: 'Pasteurtrans', logo: pasteur },
    ];

    const secondRowLogos = [
        { name: 'Primajasa', logo: primajasa },
        { name: 'Rosin', logo: rosin },
        { name: 'Jackal', logo: jackal },
        { name: 'Arnes', logo: arnes }
    ];

    const thirdRowLogos = [
        { name: 'Daytrans', logo: daytrans },
        { name: 'Xtrans', logo: xtrans },
        { name: 'Aragon', logo: aragon },
        { name: 'Lintas', logo: lintas }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">

                    {/* Left side content */}
                    <div className="md:w-2/5">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Partner Travel
                        </h2>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Operator Travel Favorit
                        </h3>
                        <p className="text-base text-gray-600 leading-relaxed">
                            Baik untuk liburan atau pulang ke rumah, kini Anda bisa pesan tiket travel favorit dengan lebih mudah bersama kami.
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