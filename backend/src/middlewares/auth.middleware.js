const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // format: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ 
            message: 'Token invalid atau kadaluarsa' 
        });

        req.user = user; // simpan payload user (misal: { id, role })
        console.log(req.user);
        next();
    });
};

const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        console.log(allowedRoles);
        // versi menggunakan idrole
        // if (!allowedRoles.includes(req.user.idRole)) {

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Forbidden: insufficient rights' 
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
