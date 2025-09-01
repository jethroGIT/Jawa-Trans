const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Role = db.Role;
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

const findUserOrFail = async (email, password) => {
    const existingUser = await User.findOne({
        where: { email },
        include: [
            {
                model: Role,
                as: 'role'
            }
        ]
    });
    if (!existingUser) {
        throw new Error('Email atau password salah')
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new Error('Email atau password salah')
    }
    return existingUser;
};

const JWTSecretFinder = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT SECRET tidak ditemukan!')
    }
    return secret;
};


const login = async (email, password) => {
    fieldValidation(email, password);

    const user = await findUserOrFail(email, password);

    const payload = {
        idUser: user.idUser,
        idRole: user.idRole,
        role: user.role.nama,
        nama: user.nama,
        email: user.email,
        telephone: user.telephone,
        iat: Math.floor(Date.now() / 1000)
    };
    const expiresIn = '2h';
    JWTSecretFinder();

    const token = jwt.sign(payload, JWTSecretFinder(), { expiresIn });
    return {
        user: {
            idUser: user.idUser,
            idRole: user.idRole,
            role: user.role.nama,
            nama: user.nama,
            email: user.email,
            telephone: user.telephone
        },
        token
    };
};

const blacklistedTokens = new Set();

const logout = async (token) => {
    try {
        console.log('=== DEBUG LOGOUT ===');
        console.log('1. Token yang diterima:', token);
        console.log('2. Type of token:', typeof token);

        // Cek apakah token ada
        if (!token) {
            throw new Error('Token tidak ditemukan');
        }

        const secret = JWTSecretFinder();
        console.log('3. JWT_SECRET exists:', !!secret);
        console.log('4. JWT_SECRET length:', secret ? secret.length : 0);

        // Verifikasi token
        console.log('5. Attempting to verify token...');
        const decoded = jwt.verify(token, secret);
        console.log('6. Token verified successfully:', decoded);
        const timeNow = Math.floor(Date.now() / 1000);
        console.log('7. Current timestamp:', timeNow);
        console.log('8. Token exp:', decoded.exp);
        console.log('9. Token expired?', decoded.exp < timeNow);
        console.log('10. Time until expiry (seconds):', decoded.exp - timeNow);

        // Tambahkan ke blacklist
        blacklistedTokens.add(token);
        console.log('11. Token added to blacklist');
        console.log(blacklistedTokens);

        const timeUntilExpiry = (decoded.exp - timeNow) * 1000;

        if (timeUntilExpiry > 0) {
            setTimeout(() => {
                blacklistedTokens.delete(token);
                console.log('Token removed from blacklist (expired)');
            }, timeUntilExpiry);
        }

        console.log('12. Logout successful');
        return {
            success: true,
            message: 'Logout berhasil'
        };
    } catch (error) {
        console.log('=== ERROR LOGOUT ===');
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
        console.log('Error stack:', error.stack);

        // Cek jenis error JWT
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


module.exports = {
    login,
    logout,
}
