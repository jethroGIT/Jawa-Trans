import { apiRequest } from "../api";

async function fetchBusMitra(idMitra) {
    try {
        const response = await apiRequest("bus", "GET");
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
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
        const formData = new FormData();
        formData.append('idMitra', payload.idMitra);
        formData.append('kode_bus', payload.kode_bus);
        formData.append('type', payload.type);
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

        const response = await apiRequest("bus", "POST", formData);

        return response.data;

    } catch (error) {
        console.log("Pesan error:", error.message);
        return {
            success: false,
            message: error.message
        }
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
        const formData = new FormData();
        formData.append('idMitra', payload.idMitra);
        formData.append('kode_bus', payload.kode_bus);
        formData.append('type', payload.type);
        formData.append('kapasitas', payload.kapasitas);
        formData.append('status', payload.status);

        if (Array.isArray(payload.fasilitas)) {
            payload.fasilitas.forEach((id) => {
                formData.append('fasilitas[]', id);
            });
        }

        if (Array.isArray(payload.fotos) && payload.fotos.length > 0) {
            payload.fotos.forEach((file) => {
                formData.append('fotos', file);
            });
        }

        // Optional: Kirim list foto LAMA yang dipertahankan (agar backend tahu mana yg dihapus)
        // Tergantung logika backend Anda, ini bisa dikirim sebagai JSON string
        if (Array.isArray(payload.existingPhotos)) {
            // Contoh: Mengirim nama file/ID foto lama yang user TIDAK hapus
            // formData.append('existing_photos', JSON.stringify(payload.existingPhotos));
        }

        const response = await apiRequest(`bus/${id}`, "PUT", formData);

        return response.data;

    } catch (error) {
        return(error.message);
    }
}

async function fetchDeleteBus(id){
    try {
        const response = await apiRequest(`bus/${id}`, "DELETE");
        return response.message;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export default {
    fetchBusMitra,
    fetchFasilitas,
    fetchCreateBus,
    fetchBusById,
    fetchUpdateBus,
    fetchDeleteBus
}