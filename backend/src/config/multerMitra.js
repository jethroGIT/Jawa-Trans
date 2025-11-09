const multer = require('multer');
const path = require('path');

// Path absolut supaya multer tidak bingung
const uploadPath = path.join(__dirname, '../uploads/mitra');

// Konfigurasi storage untuk logo mitra
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Format: mitra_{id}_{nama}.{format}
        const mitraId = req.params.id || 'temp';
        const namaMitra = path.parse(file.originalname).name;
        const formatFile = path.extname(file.originalname);
        cb(null, `mitra_${mitraId}_${namaMitra}${formatFile}`);
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

// Konfigurasi upload untuk mitra (single file)
const uploadLogoMitra = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Max 2MB untuk logo
    },
    fileFilter: fileFilter
});

module.exports = uploadLogoMitra;