'use strict';

var _ = require('lodash');

class Image {
    constructor(id, pathToImage, fileType) {
        this.id = id;
        this.webUrl = '';
        this.pathToImage = pathToImage;
        this.fileType = fileType;
    }
	updateWebUrl(url) {
		if (_.isUndefined(url) && !_.isString(url)) {
		    return;
		}

	    this.webUrl = url;
	}
}

module.exports = Image;