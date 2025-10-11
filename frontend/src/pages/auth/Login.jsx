import { useState } from "react";
import authService from "../../services/authService";
import AuthLayout from "../../layouts/AuthLayout";
import Swal from "sweetalert2";
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useDocumentTitle('Login');

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setResponse(null);
        setIsLoading(true);

        try {
            const data = await authService.loginRequest(email, password);
            setResponse(data);
            localStorage.setItem("token", data.token);

            Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: data.message,
                timer: 3000,
                showConfirmButton: false,
                width: "350px",
            });
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
        <AuthLayout title="Login">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email Anda"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password Anda"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
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
                    ) : 'Login'}
                </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                >
                    Daftar disini
                </Link>
            </p>
        </AuthLayout>
    );
}