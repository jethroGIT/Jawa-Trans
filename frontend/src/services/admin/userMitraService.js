import { apiRequest, apiRequestWithAuth } from "../api";
import authService from "../authService";

async function getAllUserMitra() {
    try {
        // Get current user to extract idMitra
        const user = authService.getUser();
        if (!user || !user.idMitra) {
            throw new Error('ID Mitra tidak ditemukan. Silakan login kembali.');
        }

        const response = await apiRequestWithAuth(`employees/mitra/${user.idMitra}`, 'GET');
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data karyawan mitra');
    }
}

async function getAllAdmins() {
    try {
        const response = await apiRequestWithAuth('employees/admins', 'GET');
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data admin');
    }
}

async function getUserById(idUser) {
    try {
        const response = await apiRequestWithAuth(`employees/${idUser}`, 'GET');
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data user');
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
        const response = await apiRequestWithAuth('employees', 'POST', payload);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal membuat karyawan baru');
    }
}

async function fetchUpdateUser(idUser, payload) {
    try {
        const response = await apiRequestWithAuth(`employees/${idUser}`, 'PUT', payload);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal memperbarui karyawan');
    }
}

export default { getAllUserMitra, getAllAdmins, getUserById, getAllRoles, getAllMitras, fetchCreateUser, fetchUpdateUser };