/**
 * Customer Service
 * 
 * Service layer untuk mengelola operasi CRUD customer.
 * 
 * Dependencies:
 * - Sequelize ORM
 * - Customer model
 * - Bcrypt untuk hash password
 */

const db = require('../models');
const Customer = db.Customer;
const bcrypt = require('bcrypt');

/**
 * Konfigurasi
 */
const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Helper: Find Customer by ID
 */
const findCustomerOrFail = async (id) => {
    const customer = await Customer.findByPk(id);
    if (!customer) {
        throw new Error('Customer tidak ditemukan!');
    }
    return customer;
};

/**
 * Helper: Check Duplicate Email
 */
const checkDuplicateEmail = async (email, excludeId = null) => {
    const existing = await Customer.findOne({ where: { email } });

    if (existing && existing.idUser != excludeId) {
        throw new Error('Email sudah digunakan!');
    }
    return true;
};

/**
 * Helper: Check Duplicate Phone
 */
const checkDuplicatePhone = async (telephone, excludeId = null) => {
    const existing = await Customer.findOne({ where: { telephone } });

    if (existing && existing.idUser != excludeId) {
        throw new Error('Nomor telepon sudah digunakan!');
    }
    return true;
};

/**
 * Helper: Validasi Input
 */
const validateInput = ({ nama, alamat, telephone, email, password }) => {
    if (!nama || !alamat || !telephone || !email) {
        throw new Error('Nama, alamat, telepon, dan email wajib diisi!');
    }

    if (password && password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Password minimal ${MIN_PASSWORD_LENGTH} karakter!`);
    }
    return true;
};

/**
 * Get All Customers
 */
const getAllCustomers = async () => {
    return await Customer.findAll();
};

/**
 * Get Customer By ID
 */
const getCustomerById = async (id) => {
    return await findCustomerOrFail(id);
};

/**
 * Create Customer
 */
const createCustomer = async ({ nama, alamat, telephone, email, password }) => {
    validateInput({ nama, alamat, telephone, email, password });

    if (!password) {
        throw new Error('Password wajib diisi!');
    }

    await checkDuplicateEmail(email);
    await checkDuplicatePhone(telephone);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return await Customer.create({
        nama,
        alamat,
        telephone,
        email,
        password: hashedPassword
    });
};

/**
 * Update Customer
 */
const updateCustomer = async ({ id, nama, alamat, telephone, email, password }) => {
    const customer = await findCustomerOrFail(id);

    validateInput({ nama, alamat, telephone, email, password: password || 'dummy123' }); // Skip password check if not provided

    await checkDuplicateEmail(email, id);
    await checkDuplicatePhone(telephone, id);

    const updateData = {
        nama,
        alamat,
        telephone,
        email
    };

    if (password) {
        if (password.length < MIN_PASSWORD_LENGTH) {
            throw new Error(`Password minimal ${MIN_PASSWORD_LENGTH} karakter!`);
        }
        updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    return await customer.update(updateData);
};

/**
 * Delete Customer
 */
const deleteCustomer = async (id) => {
    const customer = await findCustomerOrFail(id);
    return await customer.destroy();
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
