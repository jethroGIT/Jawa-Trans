const API_BASE = "http://localhost:8000/api";

export async function apiRequest(endpoint, method = "GET", body = null, headers = {}) {
    const config = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}/${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export async function apiRequestWithAuth(endpoint, method = "GET", body = null, headers = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    return apiRequest(endpoint, method, body, {
        ...headers,
        'Authorization': `Bearer ${token}`
    });
}
