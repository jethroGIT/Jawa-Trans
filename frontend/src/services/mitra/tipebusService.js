import { apiRequest, apiRequestWithAuth } from "../api";
import authService from "../authService";

async function fetchAllTipeByMitra() {
    try {
        const mitra = authService.getUser();

        if (!mitra?.idMitra) {
            throw new Error('ID Mitra tidak ditemukan');
        }

        const response = await apiRequestWithAuth(`mitra/${mitra.idMitra}/tipebus`, "GET");
        return response.data || [];
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data tipe bus');
    }
}

async function fetchTipeBusById(id) {
    try {
        const response = await apiRequest(`tipebus/${id}`, "GET");
        console.log("Response from fetchTipeBusById:", response);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data tipe bus');
    }
}

async function fetchFasilitas() {
    try {
        const response = await apiRequest('fasilitas', "GET");
        return response.data || [];
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data fasilitas');
    }
}

async function fetchCreateTipeBus(payload) {
    try {
        const mitra = authService.getUser();
        if (!mitra?.idMitra) {
            throw new Error('ID Mitra tidak ditemukan');
        }
        payload.idMitra = mitra.idMitra;

        const formData = new FormData();
        formData.append('idMitra', payload.idMitra);
        formData.append('tipe', payload.tipe);
        formData.append('kapasitas', payload.kapasitas);

        if (Array.isArray(payload.fasilitas)) {
            payload.fasilitas.forEach((id) => {
                formData.append('fasilitas[]', id);
            });
        }

        if (Array.isArray(payload.fotos)) {
            payload.fotos.forEach((file) => {
                formData.append('fotos', file);
            });
        }

        const response = await apiRequest('tipebus', "POST", formData);
        return response.data;
    }
    catch (error) {
        throw new Error(error.message || 'Gagal membuat tipe bus');
    }
}

async function fetchUpdateTipeBus(id, payload) {
    try {
        const mitra = authService.getUser();
        if (!mitra?.idMitra) {
            throw new Error('ID Mitra tidak ditemukan');
        }
        payload.idMitra = mitra.idMitra;

        const formData = new FormData();
        formData.append('idMitra', payload.idMitra);
        formData.append('tipe', payload.tipe);
        formData.append('kapasitas', payload.kapasitas);

        if (Array.isArray(payload.fasilitas)) {
            payload.fasilitas.forEach((id) => {
                formData.append('fasilitas[]', id);
            });
        }

        if (Array.isArray(payload.existingPhotos)) {
            payload.existingPhotos.forEach((photo) => {
                // Jika photo adalah URL lengkap, ambil nama filenya saja
                // Misal: http://localhost:3000/uploads/foto_bus/1709...jpg -> 1709...jpg
                const filename = photo.split('/').pop();
                formData.append('existingPhotos[]', filename);
            });
        }

        const response = await apiRequest(`tipebus/${id}`, "PUT", formData);
        return response.data;
    }
    catch (error) {
        throw new Error(error.message || 'Gagal memperbarui tipe bus');
    }
}

async function fetchDeleteTipeBus(id) {
    try {
        const response = await apiRequest(`tipebus/${id}`, "DELETE");
        return response.message;
    }
    catch (error) {
        throw new Error(error.message || 'Gagal menghapus tipe bus');
    }
}

export default { fetchAllTipeByMitra, fetchTipeBusById, fetchFasilitas, fetchCreateTipeBus, fetchUpdateTipeBus, fetchDeleteTipeBus };