const multer = require('multer');

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let message = err.message;

        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'Ukuran file maksimal 5MB';
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Maksimal upload 5 foto bus';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Field file tidak sesuai';
                break;
        }

        return res.status(400).json({
            success: false,
            message
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    next();
};

module.exports = multerErrorHandler;