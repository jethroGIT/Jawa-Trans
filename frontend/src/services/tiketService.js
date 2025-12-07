import { apiRequest } from "./api";

async function fetchTiketUser(idUser) {
    try {
        const response = await apiRequest(`reservasi/user/${idUser}`, "GET");
        return response.data || [];
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

async function fethcTiketReservasi(idReservasi) {
    try {
        const response = await apiRequest(`reservasi/${idReservasi}`, "GET");
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

async function fetchTiketById(idReservasi) {
    try {
        const response = await apiRequest(`reservasi/${idReservasi}`, "GET");
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export default {
    fetchTiketUser,
    fethcTiketReservasi,
    fetchTiketById
}