const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: 'public/',
    filename: function (req, file, cb) {
        cb(
            null,
            file.originalname.split('.').slice(0, -1).join('.') +
                '-' +
                Date.now() +
                path.extname(file.originalname)
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|jfif/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Only images accepted!');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).array('images', 10);

router.post('/', (req, res, next) => {
    upload(req, res, function (err) {
        console.log('files', req.files);

        if (err) {
            console.log('error', err);
            res.json({ error: err.message });
        } else if (req.files.length === 0) {
            console.log('Error: No File Selected!');
            res.json({ error: 'No File Selected' });
        } else {
            const files = req.files;
            const fileNamesArray = files.map((file) => file.filename);

            res.json({
                sucess: true,
                message: 'Uploaded Successfully',
                fileNamesArray,
            });
        }
    });
});

module.exports = router;
