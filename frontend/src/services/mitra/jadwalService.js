import { apiRequest } from "../api";

async function fetchCallBusTerminal() {
    try {
        const [buses, terminals] = await Promise.all([
            apiRequest("bus", "GET"),
            apiRequest("terminal", "GET")
        ]);
        return {
            buses: buses.data || [], // Sesuaikan struktur response backend
            terminals: terminals.data || []
        };
    } catch {
        return {
            success: false,
            message: error.message
        }
    }
}

async function fetchCreateJadwal(payload) {
    try {
        const response = await apiRequest("jadwal", "POST", payload);
        return response.message;
    } catch (error) {
        return error.message;
    }
}

async function fetchJadwalById(id) {
    try {
        const response = await apiRequest(`jadwal/${id}`, "GET");
        return response.data;
    } catch (error) {
        return error.message;
    }
}

async function fetchUpdateJadwal(id, payload) {
    try {
        const response = await apiRequest(`jadwal/${id}`, "PUT", payload);
        return response.data;
    } catch (error) {
        return error.message
    }
}

async function fetchDeleteJadwal(id) {
    try {
        const response = await apiRequest(`jadwal/${id}`, "DELETE");
        return response.data;
    } catch (error) {
        return error.message
    }
}

export default {
    fetchCallBusTerminal,
    fetchCreateJadwal,
    fetchJadwalById,
    fetchUpdateJadwal,
    fetchDeleteJadwal

}