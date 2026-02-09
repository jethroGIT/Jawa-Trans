import axios from 'axios';

const API_BASE = "http://localhost:8000/api";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

async function getAllRoles() {
    try {
        const response = await api.get('/roles');
        return response.data.data; // Extract data from {success, data} structure
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Gagal mengambil data roles';
        throw new Error(message);
    }
}

async function getRoleById(idRole) {
    try {
        const response = await api.get(`/roles/${idRole}`);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Gagal mengambil data role';
        throw new Error(message);
    }
}

async function createRole(payload) {
    try {
        const response = await api.post('/roles', payload);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Gagal membuat role';
        throw new Error(message);
    }
}

async function updateRole(idRole, payload) {
    try {
        const response = await api.put(`/roles/${idRole}`, payload);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Gagal memperbarui role';
        throw new Error(message);
    }
}

async function deleteRole(idRole) {
    try {
        const response = await api.delete(`/roles/${idRole}`);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Gagal menghapus role';
        throw new Error(message);
    }
}

export default { getAllRoles, getRoleById, createRole, updateRole, deleteRole };