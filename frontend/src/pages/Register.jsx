import { useState } from "react";
import { registerRequest } from "../services/api";
import AuthLayout from "../layouts/AuthLayout";

export default function RegisterPage() {
    const [nama, setNama] = useState("");
    const [alamat, setAlamat] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setResponse(null);

        try {
            const data = await registerRequest({ nama, alamat, telephone, email, password });
            setResponse(data);
        } catch(err) {
            setError(err.message);
        }
    }

    return (
        <AuthLayout title="Register">
            <form onSubmit ={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="form-label">Nama</label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Masukan nama Anda"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="form-label">Alamat</label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Masukan alamat Anda"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="form-label">Telephone</label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="Masukan nomer telephone Anda"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukan email Anda"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukan password Anda"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Register
                </button>
            </form>

            {error && (
                <div className="alert alert-danger mt-3">{error}</div>
            )}

            {response && (
                <div className="mt-3">
                    <h6>Respon API</h6>
                    <pre className="bg-light p-2 rounded">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </AuthLayout>
    );

}