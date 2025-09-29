const API_BASE = "http://localhost:8000/api";

export async function loginRequest(email, password) {
    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function registerRequest({ nama, alamat, telephone, email, password }) {
    const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nama, alamat, telephone, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}
