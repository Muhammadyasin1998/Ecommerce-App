


const multer = require('multer');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/upload');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const filter = (req, file, cb) => {

    if (file.mimeType === 'image/png' || file.mimeType === 'image/jpeg') {
        cb(null, true);

    } else {
        cb(null, false);
    }

}

const upload = multer({
    storage: storage, limits: {

        fileSize: 1024 * 1024 * 5
    },
    filter: filter,
});


module.exports =upload;