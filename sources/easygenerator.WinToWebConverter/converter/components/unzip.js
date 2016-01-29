'use strict';

var AdmZip = require('adm-zip');
var fileType = require('file-type');
var _ = require('lodash');
var config = require('../../config');

module.exports = function unzip(buffer, directoryPath) {
    let typeOfFile = fileType(buffer);
    if (_.some(config.supportedArchivesType, type=> type === typeOfFile.ext)) {
		let zip = new AdmZip(buffer);
		zip.extractAllTo(directoryPath, true);
        return true;
    } else {
        return false;
    }
}