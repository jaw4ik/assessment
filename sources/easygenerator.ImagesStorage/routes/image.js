'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();
var co = require('co');
var ErrorsFactory = require('../models/errors');
var OriginalImageBucket = require('../aws/OriginalImageBucket');
var ResizedImageBucket = require('../aws/ResizedImageBucket');
var ImageResizer = require('../resizer');
var config = require('../config');
var uploadFileMiddleware = require('../middlewares/uploadFile');
var optionalUploadDataParser = require('../middlewares/optionalUploadDataParser');
var imageModelBinder = require('../middlewares/imageModelBinder');
var auth = require('../middlewares/auth');
var ImageRepository = require('../db/ImageRepository');
var Image = require('../models/Image');
var UrlHelper = require('../utils/urlHelper');

var repository = new ImageRepository();
var originalImageBucket = new OriginalImageBucket();
var resizedImageBucket = new ResizedImageBucket();

var resizeImage = function* (image, width, height, scaleBySmallerSide) {
    let imageResizer = new ImageResizer(image);
    let newImage = yield imageResizer.resize(width, height, scaleBySmallerSide);
    let format = yield imageResizer.getImageData(ImageResizer.getters.format);
    return {
        image: newImage,
        mimetype: `image/${format.toLowerCase()}`
    };
};

var getResizedImagePath = (filename, width, height, scaleBySmallerSide) => {
    let extname = path.extname(filename);
    let basename = path.basename(filename, extname);
    return `${basename}-w${width}-h${height}-${scaleBySmallerSide}${extname}`;
};

router.get('/:filename', (req, res, next) => co(function* () {
    let filename = req.params.filename;
    let width = parseInt(req.query.width, 10);
    let height = parseInt(req.query.height, 10);
    let scaleBySmallerSide = !!req.query.scaleBySmallerSide && req.query.scaleBySmallerSide === 'true';

    if (!filename) {
        throw ErrorsFactory.badRequest();
    }

    let originalImageExists = yield originalImageBucket.fileExists(filename);
    if (!originalImageExists) {
        return res.redirect(config.imageNotFoundUrl);
    }

    if (Number.isNaN(width) && Number.isNaN(height)) {
        return res.redirect(`${originalImageBucket.url}${filename}`);
    }

    let s3ImagePath = getResizedImagePath(filename, width, height, scaleBySmallerSide);
    let resizedImageExists = yield resizedImageBucket.fileExists(s3ImagePath);
    if (resizedImageExists) {
        return res.redirect(`${resizedImageBucket.url}${s3ImagePath}`);
    }
    let originalImage = yield originalImageBucket.getFile(filename);
    let resizedImage = null;
    try {
        resizedImage = yield* resizeImage(originalImage, width, height, scaleBySmallerSide);
    } catch (e) {
        return res.redirect(`${originalImageBucket.url}${filename}`);
    }

    if (!resizedImage || !resizedImage.image) {
        return res.redirect(`${originalImageBucket.url}${filename}`);
    }
    yield resizedImageBucket.putBuffer(resizedImage.image, s3ImagePath, resizedImage.mimetype);

    return res.redirect(`${resizedImageBucket.url}${s3ImagePath}`);
}).catch(next));

router.post('/upload', auth, uploadFileMiddleware, optionalUploadDataParser, (req, res, next) => co(function* () {
    let file = req.file;
    let image = new Image(null, file.originalname, req.user.email, new Date(), file.size);
    yield originalImageBucket.putBuffer(file.buffer, image.filename, file.mimetype);
    yield repository.insert(image);

    let prepareResizedImages = req.optionalData ? req.optionalData.prepareResizedImages : [];
    for (let resizingData of prepareResizedImages) {
        if (resizingData.required && resizingData.width && resizingData.height) {
            try {
                let resizedImage = yield* resizeImage(file.buffer, resizingData.width, resizingData.height, resizingData.scaleBySmallerSide);
                if (!resizedImage || !resizedImage.image) {
                    continue;
                }
                let s3ImagePath = getResizedImagePath(image.filename, resizingData.width, resizingData.height, resizingData.scaleBySmallerSide);
                yield resizedImageBucket.putBuffer(resizedImage.image, s3ImagePath, resizedImage.mimetype);
            } catch (e) {
                continue;
            }
        }
    }

    res.status(200).json({
        id: image.id,
        title: image.title,
        url: UrlHelper.getImageUrl(req, image.filename)
    });
}).catch(next));

router.delete('/', auth, imageModelBinder, (req, res, next) => co(function* () {
    let image = req.image;
    yield repository.remove(image.id);
    yield originalImageBucket.deleteFile(image.filename);
    res.status(200).json({
        success: true
    });
    let resizedImagesToDelete = yield resizedImageBucket.list(image.id);
    if (resizedImagesToDelete) {
        yield resizedImageBucket.deleteMultiple(resizedImagesToDelete);
    }
}).catch(next));

module.exports = router;