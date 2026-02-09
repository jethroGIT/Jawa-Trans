const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Customer = db.Customer;
const Employee = db.Employee;
require('dotenv').config();

// Reusable Helper 
const fieldValidation = (email, password) => {
    if (!email || !password) {
        throw new Error('Email dan password tidak boleh kosong!')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Format email tidak valid!')
    }
    return true;
};

const registerValidation = ({ nama, alamat, telephone, email, password }) => {
    if (!nama || !alamat || !telephone || !email || !password) {
        throw new Error('Semua field wajib diisi!')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Format email tidak valid!')
    }

    if (password.length < 8) {
        throw new Error('Password kurang dari 8 karakter')
    }
    return true;
}

const JWTSecretFinder = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT SECRET tidak ditemukan!')
    }
    return secret;
};

// LOGIN CUSTOMER
const loginCustomer = async (email, password) => {
    fieldValidation(email, password);

    const customer = await Customer.findOne({
        where: { email }
    });

    if (!customer) {
        throw new Error('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
        throw new Error('Email atau password salah');
    }

    const payload = {
        idUser: customer.idUser,
        userType: 'customer',
        idRole: 4, // customer role
        role: 'customer',
        nama: customer.nama,
        email: customer.email,
        telephone: customer.telephone,
        iat: Math.floor(Date.now() / 1000)
    };

    const expiresIn = '2h';
    const token = jwt.sign(payload, JWTSecretFinder(), { expiresIn });

    return {
        user: {
            idUser: customer.idUser,
            userType: 'customer',
            idRole: 4,
            role: 'customer',
            nama: customer.nama,
            email: customer.email,
            telephone: customer.telephone
        },
        token
    };
};

// LOGIN EMPLOYEE (admin, staff, keuangan)
const loginEmployee = async (email, password) => {
    fieldValidation(email, password);

    const employee = await db.Employee.findOne({
        where: { email },
        include: [
            {
                model: db.Role,
                as: 'role'
            },
            {
                model: db.Mitra,
                as: 'mitra'
            }
        ]
    });

    if (!employee) {
        throw new Error('Email atau password salah');
    }

    if (employee.status === 0) {
        throw new Error('Akun Anda tidak aktif. Hubungi administrator.');
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
        throw new Error('Email atau password salah');
    }

    const payload = {
        idEmployee: employee.idEmployee,
        userType: 'employee',
        idMitra: employee.idMitra,
        idRole: employee.idRole,
        role: employee.role.nama,
        nama: employee.nama,
        email: employee.email,
        telephone: employee.telephone,
        iat: Math.floor(Date.now() / 1000)
    };

    const expiresIn = '2h';
    const token = jwt.sign(payload, JWTSecretFinder(), { expiresIn });

    return {
        user: {
            idEmployee: employee.idEmployee,
            userType: 'employee',
            idMitra: employee.idMitra,
            idRole: employee.idRole,
            role: employee.role.nama,
            nama: employee.nama,
            email: employee.email,
            telephone: employee.telephone,
            mitra: employee.mitra ? {
                idMitra: employee.mitra.idMitra,
                nama: employee.mitra.nama
            } : null
        },
        token
    };
};

// LOGIN SUPERADMIN
const loginSuperAdmin = async (email, password) => {
    fieldValidation(email, password);

    const SuperAdmin = db.SuperAdmin;

    if (!SuperAdmin) {
        throw new Error('Model SuperAdmin tidak tersedia');
    }

    const superAdmin = await SuperAdmin.findOne({
        where: { email }
    });

    if (!superAdmin) {
        throw new Error('Email atau password salah');
    }

    if (superAdmin.status === 0) {
        throw new Error('Akun Anda tidak aktif. Hubungi administrator.');
    }

    let isPasswordValid = false;

    if (password === superAdmin.password) {
        isPasswordValid = true;
    }

    if (!isPasswordValid) {
        throw new Error('Email atau password salah');
    }


    const payload = {
        idSuperAdmin: superAdmin.id,
        userType: 'superadmin',
        role: 'superadmin',
        email: superAdmin.email,
        iat: Math.floor(Date.now() / 1000)
    };

    const expiresIn = '2h';
    const token = jwt.sign(payload, JWTSecretFinder(), { expiresIn });

    const userCopy = superAdmin.toJSON ? superAdmin.toJSON() : { ...superAdmin };
    delete userCopy.password;

    return {
        user: userCopy,
        token
    };
};

const blacklistedTokens = new Set();

const logout = async (token) => {
    try {
        if (!token) {
            throw new Error('Token tidak ditemukan');
        }

        const secret = JWTSecretFinder();
        const decoded = jwt.verify(token, secret);

        const timeNow = Math.floor(Date.now() / 1000);

        // Tambahkan ke blacklist
        blacklistedTokens.add(token);

        const timeUntilExpiry = (decoded.exp - timeNow) * 1000;

        if (timeUntilExpiry > 0) {
            setTimeout(() => {
                blacklistedTokens.delete(token);
            }, timeUntilExpiry);
        }

        return {
            success: true,
            message: 'Logout berhasil'
        };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token sudah expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Token tidak valid atau format salah');
        } else if (error.name === 'NotBeforeError') {
            throw new Error('Token belum aktif');
        } else {
            throw new Error('Token tidak valid atau sudah expired');
        }
    }
};

// REGISTER CUSTOMER
const registerCustomer = async ({ nama, alamat, telephone, email, password }) => {
    registerValidation({ nama, alamat, telephone, email, password });

    const existingPhone = await db.Customer.findOne({
        where: { telephone }
    });

    const existingEmail = await db.Customer.findOne({
        where: { email }
    });

    if (existingPhone) {
        throw new Error('Nomor telepon sudah digunakan!');
    }

    if (existingEmail) {
        throw new Error('Email sudah digunakan!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await db.Customer.create({
        nama,
        alamat,
        telephone,
        email,
        password: hashedPassword
    });
}

module.exports = {
    loginCustomer,
    loginEmployee,
    loginSuperAdmin,
    logout,
    registerCustomer,
    blacklistedTokens
}
