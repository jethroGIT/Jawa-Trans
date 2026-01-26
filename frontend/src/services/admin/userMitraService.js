import { apiRequest, apiRequestWithAuth } from "../api";

async function getAllUserMitra() {
    try {
        const response = await apiRequestWithAuth('users/mitra', 'GET');
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

async function getUserById(idUser) {
    try {
        const response = await apiRequestWithAuth(`users/${idUser}`, 'GET');
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

async function getAllRoles() {
    try {
        const response = await apiRequestWithAuth('roles', 'GET');
        return response.data || [];
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data role');
    }
}

async function getAllMitras() {
    try {
        const response = await apiRequestWithAuth('mitra', 'GET');
        return response.data || [];
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data mitra');
    }
}

async function fetchCreateUser(payload) {
    try {
        const response = await apiRequestWithAuth('users', 'POST', payload);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal membuat user baru');
    }
}

async function fetchUpdateUser(idUser, payload) {
    try {
        const response = await apiRequestWithAuth(`users/${idUser}`, 'PUT', payload);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal memperbarui user');
    }
}

export default { getAllUserMitra, getUserById, getAllRoles, getAllMitras, fetchCreateUser, fetchUpdateUser };