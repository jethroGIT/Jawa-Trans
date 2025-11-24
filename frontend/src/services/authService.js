// src/services/authService.js
import { apiRequest } from "./api";

function loginRequest(email, password) {
    return apiRequest("login", "POST", { email, password });
}

function registerRequest({ nama, alamat, telephone, email, password }) {
    return apiRequest("register", "POST", { nama, alamat, telephone, email, password });
}

function saveAuth(token, userData) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
}

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
    const token = getToken();
    const user = getUser();
    return !!(token && user);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export default {
    loginRequest,
    registerRequest,
    saveAuth,
    getToken,
    getUser,
    isAuthenticated,
    logout
}
