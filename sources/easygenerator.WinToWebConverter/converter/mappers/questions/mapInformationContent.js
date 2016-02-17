'use strict';

var _ = require('lodash');
var EntityFactory = require('../../models/EntityFactory');
var CommonQuestionData = require('./common/CommonQuestionData');
var mapContent = require('./mapContent');

module.exports = (slideDetails, wcicData, imagesStorage) => {
    let commonQuestionInfo = CommonQuestionData.getCommonQuestionInfo(slideDetails);

    let informationContent = EntityFactory.InformationContent(commonQuestionInfo.id, commonQuestionInfo.slideTitle,
        commonQuestionInfo.parentId, commonQuestionInfo.order);

	informationContent.learningContents = mapContent(wcicData, imagesStorage);

	return informationContent;
};