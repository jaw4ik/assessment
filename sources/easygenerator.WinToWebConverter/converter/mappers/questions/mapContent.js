'use strict';

var _ = require('lodash');
var EntityFactory = require('../../models/EntityFactory');
var constants = require('../../constants');
var cheerio = require('cheerio');
var isUrl = require('is-url');

function mapText(data, imagesStorage) {
    if (!_.isArray(data.string)) {
        return null;
    }

    if (_.isEmpty(data.string[0])) {
        return null;
    }
    let $ = cheerio.load(data.string[0]);

    $('img').each((index, element) => {
        if (!_.isObject(element.attribs)) {
            return;
        }
		if (!_.isString(element.attribs.sanaurl)) {
		    return;
		}
        let imageId = element.attribs.sanaurl.split('|')[1];
		let image = imagesStorage.getImageById(imageId);

        if (_.isNull(image)) {
            return;
        }

        element.attribs.src = image.webUrl;
    });

    $('a').each((index, element) => {
        if (!_.isObject(element.attribs)) {
            return;
        }
        if (!isUrl(element.attribs.href)) {
            let children = $(element).contents();
            $(element).after(children);
            $(element).remove();
        }
    });

	return EntityFactory.LearningContent($.html());
}

function mapImage(data, imagesStorage) {
    if (!_.isArray(data.ImageControlProperties)) {
        return null;
    }

    let imageProp = data.ImageControlProperties[0];

    if (!_.isArray(imageProp.ItemId)) {
        return null;
    }

    let itemId = imageProp.ItemId[0];
    let image = imagesStorage.getImageById(itemId);

	if (_.isNull(image)) {
		return null;
	}

    let width = '';
    let height = '';

    if (_.isArray(imageProp.Width)) {
        width = `${imageProp.Width[0]}px`;
    }

	if (_.isArray(imageProp.Height)) {
        height = `${imageProp.Height[0]}px`;
    }

    let imgTag = '';

    if (_.isArray(imageProp.Hyperlink) && _.isArray(imageProp.Hyperlink[0].ExternalValue)) {
        let link = imageProp.Hyperlink[0].ExternalValue[0];
		if (isUrl(link)) {
			imgTag = `<a href="${link}" target="_blank"><img src="${image.webUrl}" width="${width}" height="${height}"/></a>`
			return EntityFactory.LearningContent(imgTag);
        } 
    }

    imgTag = `<img src="${image.webUrl}" width="${width}" height="${height}"/>`;

    return EntityFactory.LearningContent(imgTag);
}

module.exports = (wcicData, imagesStorage) => {
    let webControls = {};
    let learningContents = [];

    if (!_.isObject(wcicData) || !_.isObject(wcicData.WebControlInfoCollection) || !_.isArray(wcicData.WebControlInfoCollection.WebControlInfo)) {
        return learningContents;
    }

    webControls = wcicData.WebControlInfoCollection.WebControlInfo;

    _.forEach(webControls, webControl => {
        let controllerType = webControl.ControllerType[0];

        let supportedControllerType = _.find(constants.supportedLearningContentControllerTypes, item => item === controllerType);

        if (_.isUndefined(supportedControllerType)) {
            return;
        }

        if (!_.isArray(webControl.Data)) {
            return;
        }

        let data = webControl.Data[0];

        switch (controllerType) {
			case constants.supportedLearningContentControllerTypes.html:
				let lcText = mapText(data, imagesStorage);
				if (_.isObject(lcText)) {
					learningContents.push(lcText);
				}
				break;
			case constants.supportedLearningContentControllerTypes.image:
				let lcImage = mapImage(data, imagesStorage);
				if (_.isObject(lcImage)) {
					learningContents.push(lcImage);
				}
				break;

        }
    });

    return learningContents;
};