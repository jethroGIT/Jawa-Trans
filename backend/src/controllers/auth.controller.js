const authService = require('../services/auth.service');

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const { user, token} = await authService.login(email, password);
        return res.status(201).json({
            success: true,
            message: `Selamat datang kembali ${user.nama} `,
            data: user,
            token: token
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    const { token } = req.body;
    try {
        const logout = await authService.logout(token);
        return res.status(200).json({
            success: true,
            message: 'Berhasil Logout!'
        })
    } catch(error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

module.exports = {
    login,
    logout,
};