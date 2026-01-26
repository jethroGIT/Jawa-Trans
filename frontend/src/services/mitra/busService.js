import { apiRequest, apiRequestWithAuth } from "../api";

async function fetchAllBus() {
    try {
        const response = await apiRequestWithAuth(`bus`, "GET");
        return response.data || [];
    } catch (error) {
        throw new Error(error.message || 'Terjadi kesalahan saat mengambil data bus');
    }
}

async function fetchFasilitas() {
    try {
        const response = await apiRequest("fasilitas", "GET");
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

async function fetchCreateBus(payload) {
    try {
        const response = await apiRequest("bus", "POST", {
            idTipe: payload.idTipe,
            plat_nomor: payload.plat_nomor,
            kode_bus: payload.kode_bus,
        });

        if (response.success === false) {
            throw new Error(response.message || 'Gagal membuat bus');
        }

        return response.data || response;

    } catch (error) {
        throw new Error(error.message || 'Terjadi kesalahan saat membuat bus');
    }
}

async function fetchBusById(id) {
    try {
        const response = await apiRequest(`bus/${id}`, "GET");
        return response.data
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

async function fetchUpdateBus(id, payload) {
    try {
        const response = await apiRequest(`bus/${id}`, "PUT", {
            idTipe: payload.idTipe,
            plat_nomor: payload.plat_nomor,
            kode_bus: payload.kode_bus,
            status: payload.status
        });

        if (response.success === false) {
            throw new Error(response.message || 'Gagal memperbarui bus');
        }

        return response.data || response;

    } catch (error) {
        throw new Error(error.message || 'Terjadi kesalahan saat memperbarui bus');
    }
}

async function fetchDeleteBus(id) {
    try {
        const response = await apiRequest(`bus/${id}`, "DELETE");
        return response.message || response.data;
    } catch (error) {
        throw new Error(error.message || 'Gagal menghapus bus');
    }
}

export default {
    fetchAllBus,
    fetchFasilitas,
    fetchCreateBus,
    fetchBusById,
    fetchUpdateBus,
    fetchDeleteBus
}