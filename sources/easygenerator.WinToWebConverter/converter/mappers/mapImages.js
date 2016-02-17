'use strict';

var path = require('path');
var _ = require('lodash');
var co = require('co');
var EntityFactory = require('../models/EntityFactory');
var ImageStorage = require('../components/ImageStorage');
var parseXml = require('../components/parseXml');
var constants = require('../constants');

module.exports = (files, pathToFilesDirectory) => {
    return co(function* () {
		let imageStorage = new ImageStorage();
        
        for (let file of files){
            let fileInfo = yield parseXml(path.join(pathToFilesDirectory, file.$.id, constants.packageFilesName.sanaFile));

			let sanaFile = fileInfo.SanaFile;

		    if (!_.isObject(sanaFile)) {
		        continue;
		    }

			let typeId = sanaFile.TypeId[0];
			let extension = sanaFile.Extension[0];

			let supportedFileType = _.find(constants.filesType, fileType => {
			   return  fileType.id.toLowerCase() === typeId.toLowerCase()
			});

			if (!_.isUndefined(supportedFileType)) {
				let fileId = file.$.id;
				let pathToImage = path.join(pathToFilesDirectory, fileId, fileId + extension);
				let fileType = supportedFileType.type;

			    let image = EntityFactory.Image(fileId, pathToImage, fileType);
			    imageStorage.add(image);
			}
        }

        return imageStorage;
    });
};