import { apiRequest } from "../api";

async function fetchTerminalMitra(params) {
    
}

async function fetchTerminalById(id, payload) {
    try {
        const response = await apiRequest(`terminal/${id}`, "GET", payload);
        return response.data
    } catch (error) {
        return error.message;
    }
}

async function fetchCreateTerminal(payload) {
    try {
        const response = await apiRequest("terminal", "POST", payload);
        return response.message
    } catch (error) {
        return error.message;
    }
}

async function fetchUpdateTerminal(id, payload) {
    try {
        const response = await apiRequest(`terminal/${id}`, "PUT", payload);
        return response.message
    } catch (error) {
        return error.message;
    }
}

async function fetchDeleteTerminal(id) {
    try {
        const response = await apiRequest(`terminal/${id}`, "DELETE");
        return response.message
    } catch (error) {
        return error.message
    }
}

export default {
    fetchTerminalById,
    fetchCreateTerminal,
    fetchUpdateTerminal,
    fetchDeleteTerminal
}