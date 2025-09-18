// src/Login.jsx
import { useState } from "react"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        // cek validasi sederhana
        if (email === "" || password === "") {
            setError("Email dan Password wajib diisi!")
            return
        }

        // contoh login dummy
        if (email === "admin@mail.com" && password === "123456") {
            localStorage.setItem("token", "dummy-jwt-token")
            alert("Login berhasil ✅")
            // kalau pakai react-router bisa redirect ke dashboard
            // navigate("/dashboard")
        } else {
            setError("Email atau Password salah ❌")
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-80"
            >
                <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
