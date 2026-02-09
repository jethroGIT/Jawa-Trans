import { apiRequestWithAuth } from "../api";

async function getMitraById(id) {
    try {
        const response = await apiRequestWithAuth(`mitra/${id}`, 'GET');
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data mitra');
    }
}

async function createMitra(formData) {
    try {
        const response = await apiRequestWithAuth('mitra', 'POST', formData);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal membuat mitra');
    }
}

async function updateMitra(id, formData) {
    try {
        const response = await apiRequestWithAuth(`mitra/${id}`, 'PUT', formData);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal memperbarui mitra');
    }
}

export default { getMitraById, createMitra, updateMitra };
