import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User, MapPin, Phone, Mail, Lock, Eye, EyeOff,
    Bus, ArrowRight, CheckCircle2,
    Timer, Tag, ShieldCheck
} from "lucide-react";
import authService from "../../services/authService";
import logoBW from '../../assets/BW/logoBW.png';
import Swal from "sweetalert2";
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function RegisterPage() {
    useDocumentTitle('Daftar Penumpang - Jawa Trans');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nama: "",
        alamat: "",
        telephone: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const data = await authService.registerRequest(formData);
            Swal.fire({
                icon: "success",
                title: "Siap Berangkat!",
                text: "Akun Anda telah terdaftar.",
                confirmButtonColor: "#1d4ed8",
                confirmButtonText: "Login",
                customClass: { popup: 'rounded-2xl' }
            }).then(() => { navigate("/login"); });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.message || "Terjadi kesalahan.",
                confirmButtonColor: "#ef4444",
            });
        } finally { setIsLoading(false); }
    }

    const benefits = [
        { 
            icon: <ShieldCheck size={20} className="text-amber-400" />, 
            title: "Transaksi Aman & Mudah", 
            sub: "Pembayaran 100% online.",
            desc: "Terverifikasi dengan berbagai metode pembayaran." 
        },
        { 
            icon: <Timer size={20} className="text-amber-400" />, 
            title: "Tepat Waktu", 
            sub: "Sesuai jadwal keberangkatan.",
            desc: "Komitmen ketepatan waktu untuk setiap perjalanan." 
        },
        { 
            icon: <Tag size={20} className="text-amber-400" />, 
            title: "Harga Terjangkau", 
            sub: "Kualitas tinggi harga bersahabat.",
            desc: "Tarif kompetitif dan transparan tanpa biaya tambahan." 
        },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-white font-sans">
            
            {/* SISI KIRI: BRANDING (DIPERKECIL MENJADI 40%) */}
            <div className="hidden lg:flex lg:w-[40%] bg-blue-700 p-12 xl:p-16 text-white flex-col justify-between relative shrink-0">
                {/* Dekorasi Latar Belakang */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-5%] right-[-5%] w-64 h-64 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[10%] left-[-5%] w-40 h-40 rounded-full bg-white blur-2xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center mb-3">
                        <img src={logoBW} alt="Logo" className="w-12 mr-3" />
                        <span className="text-xl font-black uppercase tracking-widest italic">Jawa Trans</span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight mb-10">
                            Nikmati Perjalanan <br />
                            <span className="text-amber-400">Lintas Jawa</span> Terbaik
                        </h2>

                        <div className="space-y-8">
                            {benefits.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="mt-1 bg-white/10 p-2.5 rounded-xl backdrop-blur-md shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white mb-0.5">{item.title}</h4>
                                        <p className="text-amber-200 text-[10px] font-semibold mb-1 uppercase tracking-wide">{item.sub}</p>
                                        <p className="text-blue-100 text-xs opacity-70 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SISI KANAN: FORM REGISTRASI (DIPERLUAS MENJADI 60%) */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-gray-50/50">
                <div className="w-full max-w-[620px] bg-white p-7 md:p-9">
                    <div className="mb-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Daftar Akun</h3>
                        <p className="text-gray-500 text-xs md:text-sm mt-2">Lengkapi data untuk bergabung.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Nama Lengkap */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                <User size={17} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                name="nama" type="text" required
                                className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-50 outline-none transition-all text-sm"
                                placeholder="Nama Lengkap"
                                value={formData.nama} onChange={handleChange}
                            />
                        </div>

                        {/* WhatsApp & Email (Sejajar) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-3.5">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                    <Phone size={17} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    name="telephone" type="tel" required
                                    className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-50 outline-none transition-all text-sm"
                                    placeholder="WhatsApp"
                                    value={formData.telephone} onChange={handleChange}
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                    <Mail size={17} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    name="email" type="email" required
                                    className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-50 outline-none transition-all text-sm"
                                    placeholder="Email"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Domisili */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                <MapPin size={17} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                name="alamat" type="text" required
                                className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-50 outline-none transition-all text-sm"
                                placeholder="Kota Domisili"
                                value={formData.alamat} onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                <Lock size={17} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                name="password" type={showPassword ? "text" : "password"} required
                                className="w-full pl-10 md:pl-11 pr-10 md:pr-11 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-50 outline-none transition-all text-sm"
                                placeholder="Password"
                                value={formData.password} onChange={handleChange}
                            />
                            <button
                                type="button" className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>

                        <div className="flex items-start gap-2 py-2 px-0.5">
                            <CheckCircle2 size={17} className="text-green-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] md:text-[11px] text-gray-400 leading-tight">
                                Saya setuju dengan <span className="text-blue-600 font-bold underline cursor-pointer hover:text-blue-800 transition-colors" onClick={() => setIsModalOpen(true)}>Syarat & Ketentuan</span> Jawa Trans.
                            </p>
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className={`w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl md:rounded-2xl font-semibold shadow-lg shadow-blue-700/20 transition-all flex items-center justify-center gap-2 text-sm mt-3 ${isLoading ? 'opacity-70 cursor-wait' : 'active:scale-[0.98]'}`}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Daftar Akun</span>
                                    <ArrowRight size={17} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-3 text-center text-xs md:text-sm">
                        <p className="text-gray-500">
                            Sudah punya akun?{" "}
                            <Link to="/login" className="text-blue-700 font-bold hover:text-blue-800 transition-colors">
                                Masuk
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* MODAL: SYARAT & KETENTUAN */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-blue-700 px-6 md:px-8 py-6 text-white flex items-center justify-between">
                            <h2 className="text-2xl md:text-3xl font-bold">Syarat & Ketentuan</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white hover:bg-blue-600 p-2 rounded-lg transition-colors"
                            >
                                <EyeOff size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto flex-1 px-6 md:px-8 py-6 text-gray-700 text-sm md:text-base">
                            <div className="space-y-4">
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">1. Penerimaan Syarat & Ketentuan</h3>
                                    <p className="leading-relaxed">Dengan menggunakan layanan Jawa Trans, Anda setuju untuk mematuhi semua syarat dan ketentuan yang ditetapkan. Jika Anda tidak setuju dengan syarat ini, mohon tidak melanjutkan penggunaan layanan kami.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">2. Akun Pengguna</h3>
                                    <p className="leading-relaxed">Anda bertanggung jawab atas kerahasiaan password dan informasi akun Anda. Semua aktivitas yang terjadi di akun Anda adalah tanggung jawab Anda. Jangan bagikan akun Anda kepada pihak lain.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">3. Penggunaan Layanan</h3>
                                    <p className="leading-relaxed">Layanan Jawa Trans hanya untuk penggunaan pribadi dan legal. Dilarang menggunakan layanan untuk aktivitas ilegal, penipuan, atau tujuan berbahaya lainnya. Kami berhak menutup akun yang melanggar ketentuan ini.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">4. Pembayaran & Refund</h3>
                                    <p className="leading-relaxed">Semua pembayaran harus dilakukan sesuai metode yang disediakan. Refund akan diberikan sesuai dengan kebijakan yang berlaku. Pembatalan pesanan dapat dilakukan minimal 24 jam sebelum keberangkatan.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">5. Perlindungan Data Pribadi</h3>
                                    <p className="leading-relaxed">Data pribadi Anda dilindungi dengan enkripsi standar industri. Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa persetujuan. Untuk informasi selengkapnya, silakan baca Kebijakan Privasi kami.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">6. Ketentuan Perjalanan</h3>
                                    <p className="leading-relaxed">Penumpang wajib hadir 30 menit sebelum keberangkatan. Membawa identitas asli dan tiket digital. Jawa Trans tidak bertanggung jawab atas keterlambatan yang disebabkan oleh lalu lintas atau kondisi luar biasa lainnya.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">7. Batasan Tanggung Jawab</h3>
                                    <p className="leading-relaxed">Jawa Trans tidak bertanggung jawab atas kehilangan barang bawaan atau kecelakaan yang bukan kesalahan kami. Semua penumpang diharapkan mempertanggung jawabkan barang mereka sendiri.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">8. Perubahan Syarat & Ketentuan</h3>
                                    <p className="leading-relaxed">Jawa Trans berhak mengubah syarat dan ketentuan kapan saja. Perubahan akan berlaku efektif setelah diumumkan. Penggunaan layanan lebih lanjut berarti Anda menerima perubahan tersebut.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">9. Hukum yang Berlaku</h3>
                                    <p className="leading-relaxed">Syarat dan ketentuan ini diatur berdasarkan hukum yang berlaku di Republik Indonesia. Setiap perselisihan akan diselesaikan melalui pengadilan yang berwenang.</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">10. Kontak Kami</h3>
                                    <p className="leading-relaxed">Jika memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui email: support@jawatrans.com atau telepon: +62-800-JAWA-TRANS</p>
                                </section>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 px-6 md:px-8 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-sm"
                            >
                                Saya Setuju
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}