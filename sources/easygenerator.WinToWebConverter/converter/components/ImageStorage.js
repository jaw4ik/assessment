'use strict';

var _ = require('lodash');
var Image = require('../models/Image');

class ImageStorage {
	constructor () {
	    this.images = [];
	}
    add(image) {
        if (image instanceof Image) {
            this.images.push(image);
        }
    }
	getImageById(id) {
		let image = _.find(this.images, image => image.id === id);

	    if (_.isObject(image)) {
	        return image;
		}

	    return null;
	}
}

module.exports = ImageStorage;