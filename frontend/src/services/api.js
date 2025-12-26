const API_BASE = "http://localhost:8000/api";

export async function apiRequest(endpoint, method = "GET", body = null, headers = {}) {
    const config = {
        method,
        headers: {
            ...headers
        },
    };

    if (body instanceof FormData) {
        // Jika FormData, kirim langsung tanpa JSON.stringify
        // Dan JANGAN set Content-Type (biar browser yang atur dengan boundary)
        config.body = body;
    } else if (body) {
        // Jika bukan FormData, kirim sebagai JSON seperti biasa
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(body);
    } else {
        // Jika tidak ada body, tetap set Content-Type untuk konsistensi
        config.headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE}/${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export async function apiRequestWithAuth(endpoint, method, body, headers = {}) {
    const token = localStorage.getItem('token');
    console.log('token:', token);

    if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    return apiRequest(endpoint, method, body, {
        ...headers,
        'Authorization': `Bearer ${token}`
    });
}
