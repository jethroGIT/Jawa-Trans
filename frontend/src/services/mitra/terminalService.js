import { apiRequest } from "../api";

async function fetchTerminalById(id) {
    try {
        const response = await apiRequest(`terminal/${id}`, "GET");
        return response.data
    } catch (error) {
        throw new Error(error.message || 'Terjadi kesalahan saat mengambil data terminal');
    }
}

async function fetchTerminal() {
    try {
        const response = await apiRequest(`terminal`, "GET");
        return response.data
    } catch (error) {
        throw new Error(error.message || 'Terjadi kesalahan saat mengambil data terminal');
    }
}

async function fetchCreateTerminal(payload) {
    try {
        const response = await apiRequest("terminal", "POST", payload);
        return response.message
    } catch (error) {
        throw new Error(error.message);
    }
}

async function fetchUpdateTerminal(id, payload) {
    try {
        const response = await apiRequest(`terminal/${id}`, "PUT", payload);
        return response.message
    } catch (error) {
        throw new Error(error.message);
    }
}

async function fetchDeleteTerminal(id) {
    try {
        const response = await apiRequest(`terminal/${id}`, "DELETE");
        return response.message
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    fetchTerminalById,
    fetchTerminal,
    fetchCreateTerminal,
    fetchUpdateTerminal,
    fetchDeleteTerminal
}