const authService = require('../services/auth.service');

// LOGIN CUSTOMER
const loginCustomer = async (req, res) => {
    const { email, password } = req.body || {};

    try {
        const { user, token } = await authService.loginCustomer(email, password);
        return res.status(200).json({
            success: true,
            message: `Selamat datang kembali ${user.nama}`,
            data: user,
            token: token
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
};

// LOGIN EMPLOYEE (admin, staff, keuangan)
const loginEmployee = async (req, res) => {
    const { email, password } = req.body || {};

    try {
        const { user, token } = await authService.loginEmployee(email, password);
        return res.status(200).json({
            success: true,
            message: `Selamat datang kembali ${user.nama}`,
            data: user,
            token: token
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
};

// LOGIN SUPERADMIN
const loginSuperAdmin = async (req, res) => {
    const { email, password } = req.body || {};

    try {
        const { user, token } = await authService.loginSuperAdmin(email, password);
        return res.status(200).json({
            success: true,
            message: `Selamat datang kembali ${user.nama}`,
            data: user,
            token: token
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
};

const logout = async (req, res) => {
    const { token } = req.body || {};
    try {
        const logout = await authService.logout(token);
        return res.status(200).json({
            success: true,
            message: 'Berhasil Logout!'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

// REGISTER CUSTOMER
const registerCustomer = async (req, res) => {
    const { nama, alamat, telephone, email, password } = req.body || {};
    try {
        const register = await authService.registerCustomer({ nama, alamat, telephone, email, password });
        return res.status(201).json({
            success: true,
            message: 'Akun berhasil dibuat!',
            data: {
                idUser: register.idUser,
                nama: register.nama,
                email: register.email
            }
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

module.exports = {
    loginCustomer,
    loginEmployee,
    logout,
    loginSuperAdmin,
    registerCustomer,
};