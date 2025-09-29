import { useState } from "react";
import { loginRequest } from "../services/api";
import AuthLayout from "../layouts/AuthLayout";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setResponse(null);

        try {
            const data = await loginRequest(email, password);
            setResponse(data);
            localStorage.setItem("token", data.token);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <AuthLayout title="Login">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email Anda"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password Anda"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
            </form>

            <p className="text-center mt-3">
                Belum punya akun? <a href="/register">Daftar disini</a>
            </p>


            {error && (
                <div className="alert alert-danger mt-3">{error}</div>
            )}

            {response && (
                <div className="mt-3">
                    <h6>Response dari API:</h6>
                    <pre className="bg-light p-2 rounded">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </AuthLayout>
    );
}
