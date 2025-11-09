const multer = require('multer');
const path = require('path');

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/foto_bus/'); // Folder tujuan
    },
    filename: function (req, file, cb) {
        // Format: bus_123_1699999999.jpg
        const uniqueSuffix = Date.now();
        cb(null, `bus_${req.body.idBus || 'temp'}_${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Filter tipe file
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan (jpg, jpeg, png)!'));
    }
};

// Konfigurasi upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Max 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;