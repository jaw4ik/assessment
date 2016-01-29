'use strict';

var _ = require('lodash');
var EntityFactory = require('../../models/EntityFactory');
var CommonQuestionData = require('./common/CommonQuestionData');
var mapContent = require('./mapContent');
var constants =require('../../constants');

module.exports = (slideDetails, wcicData, imagesStorage) => {
    let commonQuestionInfo = CommonQuestionData.getCommonQuestionInfo(slideDetails);

    let textMatchingWebControll = CommonQuestionData.getQuestionWebControl(wcicData,
		[constants.supportedQuestionControllerTypes.textMatching, constants.supportedQuestionControllerTypes.textMatchingHtml]);

    let textMatching = null;

    if (!_.isArray(textMatchingWebControll.Data)) {
        return textMatching;
    }

    if (!_.isArray(textMatchingWebControll.Data[0].question)) {
        return textMatching;
    }

    let questionData = textMatchingWebControll.Data[0].question[0];

    textMatching = EntityFactory.TextMatching(commonQuestionInfo.id, commonQuestionInfo.slideTitle, commonQuestionInfo.parentId, commonQuestionInfo.order);

	textMatching.updateFeedbacks(CommonQuestionData.getQuestionFeedbacks(questionData));

    _.forEach(questionData.answers[0].answer, answer => {
        textMatching.addAnswer(EntityFactory.TextMatchingAnswer(answer.key[0], answer.value[0]));
    });

    var questionInstruction = CommonQuestionData.getQuestionInstruction(questionData);

	let learningContents = [];

	learningContents = mapContent(wcicData, imagesStorage);

	_.forEach(learningContents, learningContent => {
		questionInstruction += learningContent.text;
	});

	textMatching.content = questionInstruction;

    return textMatching;
};