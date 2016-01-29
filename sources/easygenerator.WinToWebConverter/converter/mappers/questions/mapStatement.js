'use strict';

var _ = require('lodash');
var EntityFactory = require('../../models/EntityFactory');
var CommonQuestionData = require('./common/CommonQuestionData');
var mapContent = require('./mapContent');
var constants =require('../../constants');

module.exports = (slideDetails, wcicData, imagesStorage) => {
    let commonQuestionInfo = CommonQuestionData.getCommonQuestionInfo(slideDetails);

    let statementWebControl = CommonQuestionData.getQuestionWebControl(wcicData,
		[constants.supportedQuestionControllerTypes.statement, constants.supportedQuestionControllerTypes.statementHtml]);

	let statement = null;

	if (!_.isArray(statementWebControl.Data)) {
        return statement;
    }

    if (!_.isArray(statementWebControl.Data[0].question)) {
        return statement;
    }

    let questionData = statementWebControl.Data[0].question[0];

    statement = EntityFactory.Statement(commonQuestionInfo.id, commonQuestionInfo.slideTitle, commonQuestionInfo.parentId, commonQuestionInfo.order);

	statement.updateFeedbacks(CommonQuestionData.getQuestionFeedbacks(questionData));

    _.forEach(questionData.answers[0].answer, answer => {
        statement.addAnswer(EntityFactory.Answer(answer.value[0], (answer.$.correct === 'true')));
    });

    var questionInstruction = CommonQuestionData.getQuestionInstruction(questionData);

	let learningContents = [];

	learningContents = mapContent(wcicData, imagesStorage);

	_.forEach(learningContents, learningContent => {
		questionInstruction += learningContent.text;
	});

	statement.content = questionInstruction;

    return statement;
};