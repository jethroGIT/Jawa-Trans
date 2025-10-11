// src/services/authService.js
import { apiRequest } from "./api";

function getAllJadwal() {
    return apiRequest("jadwal", "GET");
}

export default {
    getAllJadwal
}