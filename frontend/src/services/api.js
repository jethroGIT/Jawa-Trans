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

    try {
        const response = await fetch(`${API_BASE}/${endpoint}`, config);
        
        // Cek content-type dari response
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Jika bukan JSON, ambil text
            const text = await response.text();
            console.error('Response bukan JSON:', text.substring(0, 200));
            throw new Error('Server mengembalikan response yang tidak valid. Periksa backend Anda.');
        }

        if (!response.ok) {
            throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error('JSON Parse Error:', error);
            throw new Error('Server mengembalikan response yang tidak valid. Periksa backend Anda.');
        }
        throw error;
    }
}

export async function apiRequestWithAuth(endpoint, method, body, headers = {}) {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    return apiRequest(endpoint, method, body, {
        ...headers,
        'Authorization': `Bearer ${token}`
    });
}
