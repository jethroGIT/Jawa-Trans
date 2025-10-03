import { Link } from "react-router-dom";

export default function AuthLayout({ children, title }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md"> {/* Batasi lebar di sini */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block">
                            <h1 className="text-2xl font-bold text-blue-600 mb-2">JawaTrans</h1>
                        </Link>
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                        <p className="text-gray-600 text-sm mt-2">
                            {title === "Login"
                                ? "Masuk ke akun Anda"
                                : "Buat akun baru untuk mulai"}
                        </p>
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}