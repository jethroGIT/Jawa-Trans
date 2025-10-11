// src/services/authService.js
import { apiRequest } from "./api";

function loginRequest(email, password) {
    return apiRequest("login", "POST", { email, password });
}

function registerRequest({ nama, alamat, telephone, email, password }) {
    return apiRequest("register", "POST", { nama, alamat, telephone, email, password });
}

export default {
    loginRequest,
    registerRequest
}
