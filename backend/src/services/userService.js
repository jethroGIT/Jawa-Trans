/**
 * User Service
 * 
 * Service layer untuk mengelola operasi CRUD user dengan validasi dan business logic.
 * Menggunakan pattern service layer untuk memisahkan business logic dari controller.
 * 
 * Dependencies:
 * - Sequelize ORM untuk database operations
 * - User model dengan relasi ke Role model
 * - Bcrypt untuk hash password
 * 
 * @author Jethro Andersson Apriliano Ofe
 * @version 1.0.0
 * @since 2025-08-01
 */

const db = require('../models');
const Role = db.Role;
const User = db.User;
const bcrypt = require('bcrypt');

/**
 * Helper function untuk mencari user beserta role-nya
 * 
 * @description Fungsi utility untuk mencari user by primary key dan include role.
 * Akan throw error jika user tidak ditemukan.
 * 
 * @param {number} id - ID user yang akan dicari
 * @returns {Promise<Object>} User object dengan role relation
 * @throws {Error} Jika user tidak ditemukan
 * 
 * @example
 * const user = await findUserOrFail(123);
 * console.log(user.role.nama); // Akses role name
 */
const findUserOrFail = async (id) => {
    const user = await User.findByPk(id, {
        include: {
            model: Role,
            as: 'role'
        }
    });
    if (!user) {
        throw new Error('User tidak ditemukan!');
    }
    return user;
};

/**
 * Validasi duplikasi email user
 * 
 * @description Mengecek apakah email sudah digunakan oleh user lain.
 * Menggunakan loose comparison (!=) untuk membandingkan ID agar mendukung
 * type coercion antara string dan number.
 * 
 * @param {string} email - Email yang akan divalidasi
 * @param {string|number|null} userId - ID user yang dikecualikan dari pengecekan (untuk update)
 * @returns {Promise<boolean>} True jika email available
 * @throws {Error} Jika email sudah digunakan
 * 
 * @example
 * // Untuk create user baru
 * await checkDuplicateUser('user@email.com');
 * 
 * // Untuk update user (mengecualikan user dengan ID tertentu)
 * await checkDuplicateUser('user@email.com', 123);
 */
const checkDuplicateUser = async (email, userId = null) => {
    const existingUser = await User.findOne({
        where: { email }
    });
    
    // Menggunakan loose comparison untuk mendukung type coercion
    // userId bisa berupa string (dari request params) atau number (dari database)
    if (existingUser && existingUser.idUser != userId) {
        throw new Error('Email sudah digunakan!');
    }
    return true;
};

/**
 * Validasi data user
 * 
 * @description Memvalidasi semua field yang required untuk user dan
 * memastikan password memenuhi kriteria minimum.
 * 
 * @param {number} idRole - ID role user
 * @param {string} nama - Nama lengkap user
 * @param {string} alamat - Alamat user
 * @param {string} telephone - Nomor telepon user
 * @param {string} email - Email user
 * @param {string} password - Password user (minimal 6 karakter)
 * @returns {boolean} True jika semua validasi passed
 * @throws {Error} Jika ada field yang kosong atau password terlalu pendek
 */
const userValidation = (idRole, nama, alamat, telephone, email, password) => {
    if (!idRole || !nama || !alamat || !telephone || !email || !password) {
        throw new Error('Semua field wajib diisi!');
    }
    if (password.length < 6) {
        throw new Error('Password minimal 6 karakter!');
    }
    return true;
};

/**
 * Mengambil semua data user
 * 
 * @description Retrieve semua user dari database beserta informasi role.
 * 
 * @returns {Promise<Array>} Array of user objects dengan role relation
 * 
 * @example
 * const users = await getAllUsers();
 * users.forEach(user => {
 *   console.log(`${user.nama} - ${user.role.nama}`);
 * });
 */
const getAllUsers = async () => {
    return await User.findAll({
        include: {
            model: Role,
            as: 'role'
        }
    });
};

/**
 * Mengambil user berdasarkan ID
 * 
 * @description Retrieve user spesifik berdasarkan ID beserta informasi role.
 * 
 * @param {number} id - ID user yang akan diambil
 * @returns {Promise<Object>} User object dengan role relation
 * @throws {Error} Jika user tidak ditemukan
 * 
 * @example
 * const user = await getUserById(123);
 * console.log(user.nama);
 */
const getUserById = async (id) => {
    const user = await findUserOrFail(id);
    return user;
};

/**
 * Membuat user baru
 * 
 * @description Membuat user baru dengan validasi email duplikasi,
 * validasi semua field required, dan hash password menggunakan bcrypt.
 * Password akan di-hash dengan salt rounds 10 sebelum disimpan ke database.
 * 
 * @param {Object} userData - Data user yang akan dibuat
 * @param {number} userData.idRole - ID role user
 * @param {string} userData.nama - Nama lengkap user
 * @param {string} userData.alamat - Alamat user
 * @param {string} userData.telephone - Nomor telepon user
 * @param {string} userData.email - Email user (harus unique)
 * @param {string} userData.password - Password user (minimal 6 karakter, akan di-hash)
 * @returns {Promise<Object>} User object yang baru dibuat (password sudah ter-hash)
 * @throws {Error} Jika validasi gagal atau email sudah digunakan
 * 
 * @example
 * const newUser = await createUser({
 *   idRole: 2,
 *   nama: 'John Doe',
 *   alamat: 'Jl. Example No. 123',
 *   telephone: '08123456789',
 *   email: 'john@example.com',
 *   password: 'securepassword'
 * });
 */
const createUser = async ({ idRole, nama, alamat, telephone, email, password }) => {
    // Validasi input
    userValidation(idRole, nama, alamat, telephone, email, password);
    
    // Cek duplikasi email
    await checkDuplicateUser(email);

    // Hash password dengan bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    return await User.create({
        idRole,
        nama,
        alamat,
        telephone,
        email,
        password: hashedPassword // Gunakan password yang sudah di-hash
    });
};

/**
 * Update data user
 * 
 * @description Update user yang sudah ada dengan validasi email duplikasi,
 * validasi semua field required, dan hash password baru menggunakan bcrypt.
 * Password akan di-hash ulang dengan salt rounds 10 sebelum disimpan ke database.
 * 
 * @param {Object} userData - Data user yang akan diupdate
 * @param {number} userData.id - ID user yang akan diupdate
 * @param {number} userData.idRole - ID role user
 * @param {string} userData.nama - Nama lengkap user
 * @param {string} userData.alamat - Alamat user
 * @param {string} userData.telephone - Nomor telepon user
 * @param {string} userData.email - Email user
 * @param {string} userData.password - Password user baru (akan di-hash)
 * @returns {Promise<Object>} User object yang sudah diupdate (password sudah ter-hash)
 * @throws {Error} Jika user tidak ditemukan, validasi gagal, atau email sudah digunakan
 * 
 * @example
 * const updatedUser = await updateUser({
 *   id: 123,
 *   idRole: 2,
 *   nama: 'John Doe Updated',
 *   alamat: 'Jl. New Address No. 456',
 *   telephone: '08987654321',
 *   email: 'john.updated@example.com',
 *   password: 'newpassword'
 * });
 */
const updateUser = async ({ id, idRole, nama, alamat, telephone, email, password }) => {
    // Cari user yang akan diupdate
    const user = await findUserOrFail(id);
    
    // Validasi input
    userValidation(idRole, nama, alamat, telephone, email, password);
    
    // Cek duplikasi email (kecuali untuk user ini sendiri)
    await checkDuplicateUser(email, id);

    // Hash password baru dengan bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    return await user.update({
        idRole,
        nama,
        alamat,
        telephone,
        email,
        password: hashedPassword // Gunakan password yang sudah di-hash
    });
};

/**
 * Menghapus user
 * 
 * @description Soft delete atau hard delete user berdasarkan ID.
 * 
 * @param {number} id - ID user yang akan dihapus
 * @returns {Promise<number>} Jumlah row yang terhapus (biasanya 1)
 * @throws {Error} Jika user tidak ditemukan
 * 
 * @example
 * await destroyUser(123);
 * console.log('User berhasil dihapus');
 */
const destroyUser = async (id) => {
    const user = await findUserOrFail(id);
    return await user.destroy();
};

// Export semua fungsi yang tersedia
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    destroyUser
};