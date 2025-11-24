// src/services/authService.js
import { apiRequest } from "./api";

function getAllJadwal() {
    return apiRequest("jadwal", "GET");
}

function showJadwal(idJadwal) {
    return apiRequest(`jadwal/${idJadwal}`, "GET");
}


export default {
    getAllJadwal,
    showJadwal,
}