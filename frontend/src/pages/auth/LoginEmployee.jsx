import { useState } from "react";
import authService from "../../services/authService";
import Swal from "sweetalert2";
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Link } from "react-router-dom";
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/BW/banner.png';

export default function LoginEmployeePage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    useDocumentTitle('Login Employee');

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = await authService.loginEmployeeRequest(email, password);
            authService.saveAuth(data.token, data.data);

            Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: `Selamat datang, ${data.data.nama}`,
                timer: 2000,
                showConfirmButton: false,
                width: "350px",
            });

            // Redirect based on role
            if (data.data.role === 'admin') {
                navigate('/admin/user-mitra');
            } else if (data.data.role === 'staff') {
                navigate('/mitra/bus');
            } else if (data.data.role === 'keuangan') {
                navigate('/keuangan/laporan');
            } else {
                navigate('/mitra/profil'); // Fallback
            }
        } catch (err) {
            setError(err.message);

            Swal.fire({
                icon: "error",
                title: "Gagal Masuk",
                text: err.message,
                width: "350px"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen bg-gray-50">
            <div className="flex flex-col justify-center items-center min-h-screen p-6">

                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Employee Login
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Masuk ke dashboard admin & mitra
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Staff
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="staff@jawatrans.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-lg transition-colors shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Memproses...' : 'Masuk Dashboard'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    &copy; 2024 Jawa Trans System. All rights reserved.
                </p>
            </div>
        </div>
    );
}
