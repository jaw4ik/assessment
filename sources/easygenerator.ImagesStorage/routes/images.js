'use strict';

var express = require('express');
var router = express.Router();
var co = require('co');
var auth = require('../middlewares/auth');
var ImageRepository = require('../db/ImageRepository');
var UrlHelper = require('../utils/urlHelper');

var repository = new ImageRepository();

router.get('/', auth, (req, res, next) => co(function* () {
    let email = req.user.email;
    let images = yield repository.getImagesByEmail(email);
    let mappedImages = images.sort((image1, image2) => {
        let key1 = image1.createdOn;
        let key2 = image2.createdOn;
        if(key1 < key2) return 1;
        else if(key1 === key2) return 0;
        else return -1;
    }).map(image => {
        return {
            id: image.id,
            title: image.title,
            url: UrlHelper.getImageUrl(req, image.filename)
        };
    });
    res.status(200).json(mappedImages);
}).catch(next));

module.exports = router;