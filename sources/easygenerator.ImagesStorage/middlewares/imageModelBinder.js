'use strict';

var co = require('co');
var ImageRepository = require('../db/ImageRepository');
var Image = require('../models/Image');
var ErrorsFactory = require('../models/errors');

var repository = new ImageRepository();

module.exports = (req, res, next) => co(function *(){
    var id = req.body.id;
    var image = yield repository.getImageById(id);
    if(image){
        req.image = image;
    } else {
        throw ErrorsFactory.notFound();
    }
    
}).then(next).catch(next);