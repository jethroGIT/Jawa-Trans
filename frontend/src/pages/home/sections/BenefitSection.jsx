import React from "react";
import praktis from "../../../assets/Keunggulan/praktis.png";
import custumerService from "../../../assets/Keunggulan/custumerService.png";
import infoLengkap from "../../../assets/Keunggulan/infoLengkap.png";
import pembayaranMudah from "../../../assets/Keunggulan/pembayaranMudah.png";

export default function BenefitSection() {
    const benefits = [
        {
            id: 1,
            title: "Praktis, Tanpa Repot",
            description:
                "Beli tiket bus dan travel kapan saja dan dari mana saja dengan mudah. Tak perlu repot ke terminal atau kantor agen, sekarang Anda bisa beli tiket dengan mudah dari rumah.",
            image: praktis,
            imageAlt: "Praktis Icon",
        },
        {
            id: 2,
            title: "Customer Service 24 Jam",
            description:
                "Kami menyediakan layanan Customer Service 24 jam. Jadi, kapan pun Anda punya pertanyaan, langsung telepon, chat, atau kirimkan pesan melalui App Anda. Kami akan selalu siap membantu.",
            image: custumerService,
            imageAlt: "Customer Service Icon",
        },
        {
            id: 3,
            title: "Pilihan Pembayaran Lengkap",
            description:
                "Bayar dengan berbagai metode pembayaran yang tersedia, mulai dari transfer bank, kartu kredit, hingga e-wallet. Kami memberikan kemudahan untuk Anda.",
            image: pembayaranMudah,
            imageAlt: "Payment Icon",
        },
        {
            id: 4,
            title: "Info Lengkap",
            description:
                "Mulai dari info jadwal bus dan travel, trayek, titik berangkat dan turun, dan biaya tiket, hingga foto dan fasilitasnya, semuanya bisa ditemukan di Jawa Trans.",
            image: infoLengkap,
            imageAlt: "Info Icon",
        },
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Enaknya beli tiket bus dan travel online di Jawa Trans
                    </h2>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={benefit.id}
                            className="flex flex-col md:flex-row items-center gap-6"
                        >
                            {/* Gambar - selalu di kiri */}
                            <div className="flex-shrink-0">
                                <img
                                    src={benefit.image}
                                    alt={benefit.imageAlt}
                                    className="w-24 h-24 md:w-28 md:h-28 object-contain"
                                    onError={(e) => {
                                        e.target.src =
                                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect fill='%23e5e7eb' width='160' height='160'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3EImage%3C/text%3E%3C/svg%3E";
                                    }}
                                />
                            </div>

                            {/* Konten (judul + deskripsi) */}
                            <div className="flex-1 text-right md:text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-l text-gray-700 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}