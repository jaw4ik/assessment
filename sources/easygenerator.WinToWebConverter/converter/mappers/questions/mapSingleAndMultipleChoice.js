'use strict';

var _ = require('lodash');
var EntityFactory = require('../../models/EntityFactory');
var CommonQuestionData = require('./common/CommonQuestionData');
var mapContent = require('./mapContent');
var constants =require('../../constants');

function getAnswers(answers) {
	let answersTemp = [];
    _.forEach(answers, answer => {
        answersTemp.push(EntityFactory.Answer(answer.value[0], (answer.$.correct === 'true')));
    });
	return answersTemp;
}

module.exports = (slideDetails, wcicData, imagesStorage) => {
	let commonQuestionInfo = CommonQuestionData.getCommonQuestionInfo(slideDetails);

    let questionWebControl = CommonQuestionData.getQuestionWebControl(wcicData,
		[constants.supportedQuestionControllerTypes.multipleChoice, constants.supportedQuestionControllerTypes.multipleChoiceHtml]);

    let question = null;

	if (!_.isArray(questionWebControl.Data)) {
        return question;
    }

    if (!_.isArray(questionWebControl.Data[0].question)) {
        return question;
    }

    let questionData = questionWebControl.Data[0].question[0];
	let isMultipleChoice = (questionData.options[0].multiresponse[0] === 'true');
    let answers = getAnswers(questionData.answers[0].answer);

	if (isMultipleChoice || !CommonQuestionData.isSingleChoice(answers)) {
        question = EntityFactory.MultipleChoice(commonQuestionInfo.id, commonQuestionInfo.slideTitle, commonQuestionInfo.parentId, commonQuestionInfo.order);
    } else {
        question = EntityFactory.SingleChoice(commonQuestionInfo.id, commonQuestionInfo.slideTitle, commonQuestionInfo.parentId, commonQuestionInfo.order);
    }

    question.updateFeedbacks(CommonQuestionData.getQuestionFeedbacks(questionData));

    _.forEach(answers, answer => question.addAnswer(answer));

    var questionInstruction = CommonQuestionData.getQuestionInstruction(questionData);

    let contents = [];

	contents = mapContent(wcicData, imagesStorage);

    _.forEach(contents, content => {
		questionInstruction += content.text;
    });

    question.content = questionInstruction;

    return question;
};