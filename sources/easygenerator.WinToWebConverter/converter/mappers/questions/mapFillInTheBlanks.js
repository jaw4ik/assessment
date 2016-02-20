'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');
var EntityFactory = require('../../models/EntityFactory');
var CommonQuestionData = require('./common/CommonQuestionData');
var mapContent = require('./mapContent');
var constants =require('../../constants');

function mapFibAnswers(answers) {
	let tempArray = [];
    _.forEach(answers, answer => {
		tempArray.push(EntityFactory.BlankAnswer(answer.text, answer.isCorrect, answer.groupId, answer.matchCase));
    });
	return tempArray;
}

function getAnswerType(answer) {
    if (!_.isArray(answer.type)) {
        return null;
    }
    return answer.type[0];
}

function normalizeFreeTypeAnswers(answers, outputAnswers) {
    _.forEach(answers, answer => {
        if (answer.isCorrect) {
            outputAnswers.push(answer);
        }
    });
}

function normalizeListTypeAnswers(answers, outputAnswers) {
    let output = [];
    let hasCorrectAnswer = false;
    _.forEach(answers, answer => {
        if (answer.isCorrect && hasCorrectAnswer) {
            answer.isCorrect = false;
        } else {
            hasCorrectAnswer = true;
        }
        output.push(answer);
        outputAnswers.push(answer);
    });
    return output;
}

module.exports = (slideDetails, wcicData, imagesStorage) => {
    let commonQuestionInfo = CommonQuestionData.getCommonQuestionInfo(slideDetails);

    let fibWebControll = CommonQuestionData.getQuestionWebControl(wcicData,
		[constants.supportedQuestionControllerTypes.fib]);

    let fillInTheBlanks = null;

    if (!_.isArray(fibWebControll.Data)) {
        return fillInTheBlanks;
    }

    if (!_.isArray(fibWebControll.Data[0].question)) {
        return fillInTheBlanks;
    }

    let questionData = fibWebControll.Data[0].question[0];

	let inputTemplate = '&nbsp;<input class="blankInput" data-group-id="<%= groupId.replace(/-/g, "") %>" data-match-case="false" value="">&nbsp;';
    let selectTemplate = '&nbsp;<select class="blankSelect" data-group-id="<%= groupId.replace(/-/g, "") %>"><% for (var answer of answers){ %><option value="<%= answer.text %>"><%= answer.text %></option><% } %></select>&nbsp;';
    let compiledInputTemplate = _.template(inputTemplate);
    let compiledSelectTemplate = _.template(selectTemplate);

    fillInTheBlanks = EntityFactory.FillInTheBlaks(commonQuestionInfo.id, commonQuestionInfo.slideTitle, commonQuestionInfo.parentId, commonQuestionInfo.order);

	fillInTheBlanks.updateFeedbacks(CommonQuestionData.getQuestionFeedbacks(questionData));

	let textContent = questionData.text[0];
    let answers = [];
    let winAnswers = [];

    _.forEach(questionData.answers[0].answer, answer => {
        let id = answer.id[0][0];
        let groupId = uuid.v4();
        let matchCase = answer.casesensitive[0] === 'true';

        winAnswers.push({
            id: id,
			type: getAnswerType(answer)
        });

        _.forEach(answer.options[0].option, option => {
            answers.push({
                id: id,
                text: option.answer[0],
                isCorrect: option.isCorrect[0] === 'true',
                groupId: groupId,
                matchCase: matchCase
            });
        });
    });

    let correctAnswers = [];

    _.forEach(winAnswers, winAnswer => {
		let groupAnswers = answers.filter(answer => answer.id === winAnswer.id);
        let reg = new RegExp(`\\[\\[${winAnswer.id}]]`, 'g');
        if (winAnswer.type === 'free') {
            normalizeFreeTypeAnswers(groupAnswers, correctAnswers);
			let input = compiledInputTemplate({
                groupId: groupAnswers[0].groupId
            });
            textContent = textContent.replace(reg, input);
        } else if (winAnswer.type === 'list') {
            let outputAnswers = normalizeListTypeAnswers(groupAnswers, correctAnswers);
			let select = compiledSelectTemplate({
                groupId: outputAnswers[0].groupId,
                answers: outputAnswers
            });
            textContent = textContent.replace(reg, select);
        }
    });

	var questionInstruction = CommonQuestionData.getQuestionInstruction(questionData);

	let learningContents = [];

	learningContents = mapContent(wcicData, imagesStorage);

	_.forEach(learningContents, learningContent => {
		questionInstruction += learningContent.text;
	});

    questionInstruction += textContent;

	fillInTheBlanks.content = questionInstruction;

    let blankAnswers = mapFibAnswers(correctAnswers);

    _.forEach(blankAnswers, blankAnswer => fillInTheBlanks.addAnswer(blankAnswer));

	return fillInTheBlanks;
};