import { apiRequest } from "../api";

async function fetchMitraData(id) {
    try {
        const response = await apiRequest(`mitra/${id}`, "GET")
        return response.data;
    } catch (error) {
        return error.message;
    }
}

async function fetchUpdateProfile(id, payload) {
    try {
        const response = await apiRequest(`mitra/${id}`, "PUT", payload);
        return response.message
    } catch (error) {
        return error.message
    }
}

export default {
    fetchMitraData,
    fetchUpdateProfile
}