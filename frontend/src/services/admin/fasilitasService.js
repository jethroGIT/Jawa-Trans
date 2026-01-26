import { apiRequest, apiRequestWithAuth } from "../api";

async function getAllFasilitas() {
    try {
        const response = await apiRequestWithAuth('fasilitas', 'GET');
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

async function getFasilitasById(idFasilitas) {
    try {
        const response = await apiRequestWithAuth(`fasilitas/${idFasilitas}`, 'GET');
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

async function fetchCreateFasilitas(payload) {
    try {
        const response = await apiRequestWithAuth('fasilitas', 'POST', payload);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal membuat fasilitas baru');
    }
}

async function fetchUpdateFasilitas(idFasilitas, payload) {
    try {
        const response = await apiRequestWithAuth(`fasilitas/${idFasilitas}`, 'PUT', payload);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal memperbarui fasilitas');
    }
}

async function fetchDeleteFasilitas(idFasilitas) {
    try {
        const response = await apiRequestWithAuth(`fasilitas/${idFasilitas}`, 'DELETE');
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal menghapus fasilitas');
    }
}

export default { getAllFasilitas, getFasilitasById, fetchCreateFasilitas, fetchUpdateFasilitas, fetchDeleteFasilitas };