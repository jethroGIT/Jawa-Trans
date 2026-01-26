import { apiRequestWithAuth } from "../api";

async function fetchDaftarPenumpangByMitra(idMitra) {
    try {
        const response = await apiRequestWithAuth(`mitra/${idMitra}/daftarpenumpang`, "GET");
        return response.data || [];
    } catch (error) {
        throw new Error(error.message || 'Gagal memuat jadwal daftar penumpang');
    }
}

async function fetchDaftarPenumpangById(id) {
    try {
        const response = await apiRequestWithAuth(`daftarpenumpang/${id}`, "GET");
        return response.data || {};
    } catch (error) {
        throw new Error(error.message || 'Gagal memuat detail daftar penumpang');
    }
}

export default {
    fetchDaftarPenumpangByMitra,
    fetchDaftarPenumpangById
}
