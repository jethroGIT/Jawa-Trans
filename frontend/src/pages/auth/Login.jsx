import { useState } from "react";
import authService from "../../services/authService";
import Swal from "sweetalert2";
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Link } from "react-router-dom";
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    useDocumentTitle('Login');

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setResponse(null);
        setIsLoading(true);

        try {
            const data = await authService.loginRequest(email, password);
            setResponse(data);
            authService.saveAuth(data.token, data.data);

            Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: data.message,
                timer: 3000,
                showConfirmButton: false,
                width: "350px",
            });

            if (data.data.role === 'admin') {
                navigate('/');
            } else if (data.data.role === 'mitra') {
                navigate('/');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message);

            Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: err.message,
                width: "350px"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen bg-white">
            <div className="relative flex flex-col lg:flex-row min-h-screen">
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Back Button */}
                        <Link
                            to="/"
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                        >
                            <ChevronLeftIcon className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">Kembali ke beranda</span>
                        </Link>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Masuk
                            </h1>
                            <p className="text-gray-600">
                                Masukkan email dan password untuk masuk!
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan password"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-600">
                                        Ingat saya
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                    Lupa password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : 'Masuk'}
                            </button>

                            {/* Sign Up Link */}
                            <p className="text-center text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <Link
                                    to="/register"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Daftar disini
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Right Side - Branding */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 items-center justify-center relative overflow-hidden">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }}></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center max-w-md px-8">
                        <div className="mb-6 flex justify-center">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Jawa Trans
                        </h2>
                        <p className="text-blue-200 text-lg">
                            Platform pemesanan tiket bus & travel terpercaya untuk perjalanan nyaman Anda
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}