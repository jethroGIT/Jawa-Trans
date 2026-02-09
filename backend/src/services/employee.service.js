const db = require('../models');
const Employee = db.Employee;
const Mitra = db.Mitra;
const Role = db.Role;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 6;

const findEmployeeOrFail = async (id) => {
    const employee = await Employee.findByPk(id, {
        include: [
            { model: Role, as: 'role' },
            { model: Mitra, as: 'mitra' }
        ]
    });
    if (!employee) {
        throw new Error('Employee tidak ditemukan!');
    }
    return employee;
};

const checkDuplicateEmail = async (email, excludeId = null) => {
    const existing = await Employee.findOne({ where: { email } });

    if (existing && existing.idEmployee != excludeId) {
        throw new Error('Email sudah digunakan!');
    }
    return true;
};

const validateInput = ({ idMitra, idRole, nama, nik, alamat, telephone, email, password }) => {
    if (!idMitra || !idRole || !nama || !nik || !alamat || !telephone || !email) {
        throw new Error('Semua field wajib diisi!');
    }

    if (password && password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Password minimal ${MIN_PASSWORD_LENGTH} karakter!`);
    }
    return true;
};

const getAllEmployees = async () => {
    return await Employee.findAll({
        include: [
            { model: Role, as: 'role' },
            { model: Mitra, as: 'mitra' }
        ]
    });
};

const getAllAdmin = async () => {
    // Use role name filter to avoid relying on a specific id
    return await Employee.findAll({
        include: [
            { model: Role, as: 'role', where: { nama: 'admin' } },
            { model: Mitra, as: 'mitra' }
        ]
    });
};

const getEmployeesByMitra = async (idMitra) => {
    return await Employee.findAll({
        where: { idMitra },
        include: [
            { model: Role, as: 'role' }
        ]
    });
};


const getEmployeeById = async (id) => {
    return await findEmployeeOrFail(id);
};

const createEmployee = async ({ idMitra, idRole, nama, nik, alamat, telephone, email, password }) => {
    validateInput({ idMitra, idRole, nama, nik, alamat, telephone, email, password });

    if (!password) {
        throw new Error('Password wajib diisi!');
    }

    const mitra = await Mitra.findByPk(idMitra);
    if (!mitra) throw new Error('Mitra tidak ditemukan');

    const role = await Role.findByPk(idRole);
    if (!role) throw new Error('Role tidak ditemukan');

    await checkDuplicateEmail(email);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return await Employee.create({
        idMitra,
        idRole,
        nama,
        nik,
        alamat,
        telephone,
        email,
        password: hashedPassword,
        status: 1 // Default active
    });
};

/**
 * Update Employee
 */
const updateEmployee = async ({ id, idMitra, idRole, nama, nik, alamat, telephone, email, password, status }) => {
    const employee = await findEmployeeOrFail(id);

    validateInput({
        idMitra: idMitra || employee.idMitra,
        idRole: idRole || employee.idRole,
        nama, nik, alamat, telephone, email,
        password: password || 'dummy123'
    });

    await checkDuplicateEmail(email, id);

    const updateData = {
        idMitra,
        idRole,
        nama,
        nik,
        alamat,
        telephone,
        email,
        status
    };

    if (password) {
        if (password.length < MIN_PASSWORD_LENGTH) {
            throw new Error(`Password minimal ${MIN_PASSWORD_LENGTH} karakter!`);
        }
        updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    return await employee.update(updateData);
};

/**
 * Delete Employee
 */
const deleteEmployee = async (id) => {
    const employee = await findEmployeeOrFail(id);
    return await employee.destroy();
};

module.exports = {
    getAllEmployees,
    getEmployeesByMitra,
    getAllAdmin,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
