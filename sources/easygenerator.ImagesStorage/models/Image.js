'use strict';

var path = require('path');
var uuidV4 = require('uuid/v4');

class Image{
    constructor(id, title, createdBy, createdOn, fileSize) {
        this.id = (id || uuidV4()).toLowerCase();
        this.title = title;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.size = fileSize;
    }
    get filename() {
        return `${this.id}${path.extname(this.title)}`.toLowerCase();
    }
}

module.exports = Image;