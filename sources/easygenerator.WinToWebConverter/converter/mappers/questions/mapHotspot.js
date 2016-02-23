'use strict';

var _ = require('lodash');
var EntityFactory = require('../../models/EntityFactory');
var CommonQuestionData = require('./common/CommonQuestionData');
var mapContent = require('./mapContent');
var constants = require('../../constants');

function getQueryParametrsForImage(defaultWidth, defaultHeight) {
    let width = defaultWidth;
    let height = defaultHeight;
    let ratio = 1;
    if (width > constants.maxHotspotSize.width) {
        let onePercent = defaultWidth / 100;
        let scale = constants.maxHotspotSize.width / onePercent / 100;
        width = constants.maxHotspotSize.width;
        height = defaultHeight * scale;
        ratio = constants.maxHotspotSize.width / defaultWidth;
    }

	if (height > constants.maxHotspotSize.height) {
        let onePercent = defaultHeight / 100;
        let scale = constants.maxHotspotSize.height / onePercent / 100;
        height = constants.maxHotspotSize.height;
        width = defaultWidth * scale;
		ratio = constants.maxHotspotSize.height / defaultHeight;
    }

    return {
        width: Math.round(width),
		height: Math.round(height),
		ratio: ratio
    };
}

module.exports = (slideDetails, wcicData, imagesStorage) => {
    let commonQuestionInfo = CommonQuestionData.getCommonQuestionInfo(slideDetails);

    let hotspotWebControl = CommonQuestionData.getQuestionWebControl(wcicData,
		[constants.supportedQuestionControllerTypes.hotspot, constants.supportedQuestionControllerTypes.hotspotHtml]);

    let hotspot = null;

    if (!_.isArray(hotspotWebControl.Data)) {
        return hotspot;
    }

    if (!_.isArray(hotspotWebControl.Data[0].question)) {
        return hotspot;
    }

    let questionData = hotspotWebControl.Data[0].question[0];

    hotspot = EntityFactory.Hotspot(commonQuestionInfo.id, commonQuestionInfo.slideTitle, commonQuestionInfo.parentId, commonQuestionInfo.order);
	let multiResponse = (questionData.options[0].multiresponse[0] === 'true');
	let imageId = questionData.img[0].ImageId[0];
    let image = imagesStorage.getImageById(imageId);

    let width = questionData.img[0].$.width;
    let height = questionData.img[0].$.height;

    let size = getQueryParametrsForImage(width, height);

	hotspot.isMultiple = multiResponse;
    hotspot.background = `${image.webUrl}?width=${size.width}&height=${size.height}`;

	hotspot.updateFeedbacks(CommonQuestionData.getQuestionFeedbacks(questionData));

    _.forEach(questionData.hotspots[0].hotspot, polygon => {
        let points = [];
        points.push(EntityFactory.Point(Math.round(polygon.$.x1 * size.ratio), Math.round(polygon.$.y1 * size.ratio)));
        points.push(EntityFactory.Point(Math.round(polygon.$.x2 * size.ratio), Math.round(polygon.$.y1 * size.ratio)));
        points.push(EntityFactory.Point(Math.round(polygon.$.x2 * size.ratio), Math.round(polygon.$.y2 * size.ratio)));
        points.push(EntityFactory.Point(Math.round(polygon.$.x1 * size.ratio), Math.round(polygon.$.y2 * size.ratio)));
        let hotspotPolygons = EntityFactory.HotspotPolygons(JSON.stringify(points));
        hotspot.addHotspotPolygon(hotspotPolygons);
    });

	var questionInstruction = CommonQuestionData.getQuestionInstruction(questionData);

	let learningContents = [];

	learningContents = mapContent(wcicData, imagesStorage);

	_.forEach(learningContents, learningContent => {
		questionInstruction += learningContent.text;
	});

	hotspot.content = questionInstruction;

    return hotspot;
}