
const userService = require('../services/userService');

const allUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data user!'
        });
    };
};

const show = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    };
};

const store = async (req, res) => {
    const { idRole, nama, alamat, telephone, email, password } = req.body;
    try {
        const user = await userService.createUser({ idRole, nama, alamat, telephone, email, password });
        return res.status(201).json({
            success: true,
            message: 'User telah berhasil ditambahkan.'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { idRole, nama, alamat, telephone, email, password } = req.body;
    try {
        const updateUser = await userService.updateUser({ id, idRole, nama, alamat, telephone, email, password })
        return res.status(200).json({
            success: true,
            message: "User berhasil diperbarui!",
            data: updateUser
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const destroyUser = await userService.destroyUser(id);
        return res.status(200).json({
            success: true,
            message: "User telah berhasil dihapus!",
            data: destroyUser
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

module.exports = {
    allUsers,
    show,
    store,
    update,
    destroy
}