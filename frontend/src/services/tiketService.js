import { apiRequest } from "./api";

async function fetchTiketUser(idUser) {
    try {
        const response = await apiRequest(`reservasi/user/${idUser}`, "GET");
        return response.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fethcTiketReservasi(idReservasi) {
    try {
        const response = await apiRequest(`reservasi/${idReservasi}`, "GET");
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default {
    fetchTiketUser,
    fethcTiketReservasi,
}