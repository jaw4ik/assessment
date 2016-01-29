'use strict';

var _ = require('lodash');
var EntityFactory = require('../../models/EntityFactory');
var CommonQuestionData = require('./common/CommonQuestionData');
var mapContent = require('./mapContent');
var constants =require('../../constants');

module.exports = (slideDetails, wcicData, imagesStorage) => {
    let commonQuestionInfo = CommonQuestionData.getCommonQuestionInfo(slideDetails);

    let openQuestionWebControl = CommonQuestionData.getQuestionWebControl(wcicData,
		[constants.supportedQuestionControllerTypes.openQuestion]);

    let openQuestion = null;

    if (!_.isArray(openQuestionWebControl.Data)) {
        return openQuestion;
    }

    if (!_.isArray(openQuestionWebControl.Data[0].question)) {
        return openQuestion;
    }

    let questionData = openQuestionWebControl.Data[0].question[0];
    openQuestion = EntityFactory.OpenQuestion(commonQuestionInfo.id, commonQuestionInfo.slideTitle, commonQuestionInfo.parentId, commonQuestionInfo.order);

	openQuestion.updateFeedbacks(CommonQuestionData.getQuestionFeedbacks(questionData));

	var questionInstruction = CommonQuestionData.getQuestionInstruction(questionData);

	let contents = [];

	contents = mapContent(wcicData, imagesStorage);

	_.forEach(contents, content => {
		questionInstruction += content.text;
	});

	openQuestion.content = questionInstruction;

    return openQuestion;
};