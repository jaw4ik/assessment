'use strict';

var path = require('path');
var config = require('../config');
var multer = require('multer');
var ErrorsFactory = require('../models/errors');

var upload = multer({
    limits: {
        fileSize: config.maxFileSize
    },
    fileFilter: (req, file, cb) => {
        let isSupported = config.supportedImageFormats.some(type => type === path.extname(file.originalname).toLowerCase());
        cb(isSupported ? null : ErrorsFactory.unsupportedMediaType(), isSupported);
    }
});

module.exports = upload.single('file');