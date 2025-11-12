const multer = require('multer');
const path = require('path');

// Path absolut untuk folder upload bus
const uploadPath = path.join(__dirname, '../uploads/foto_bus');

// Konfigurasi storage untuk foto bus
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const busId = req.params.id || 'temp';
        const namaFile = path.parse(file.originalname).name;
        const formatFile = path.extname(file.originalname);
        cb(null, `bus_${busId}_${namaFile}${formatFile}`);
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

// Konfigurasi upload untuk bus (multiple files)
const uploadFotoBus = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Max 5MB per file
        files: 5 // Maksimal 5 file
    },
    fileFilter: fileFilter
});

module.exports = uploadFotoBus;