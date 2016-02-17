'use strict';

var _ = require('lodash');
var EntityFactory = require('../../models/EntityFactory');
var CommonQuestionData = require('./common/CommonQuestionData');
var mapContent = require('./mapContent');
var mapInformationContent = require('./mapInformationContent');
var constants =require('../../constants');

function getAnswers(answers, imagesStorage) {
	let answersTemp = [];
    _.forEach(answers, answer => {
		let imageId = answer.img[0].SourceId[0];
        let image = _.find(imagesStorage.images, image => image.id === imageId);
        answersTemp.push(EntityFactory.SingleChoiceImageAnswer(image.webUrl, (answer.$.correct === 'true')));
    });
	return answersTemp;
}

module.exports = (slideDetails, wcicData, imagesStorage) => {
    let commonQuestionInfo = CommonQuestionData.getCommonQuestionInfo(slideDetails);

    let singleChoiceImageWebControl = CommonQuestionData.getQuestionWebControl(wcicData,
		[constants.supportedQuestionControllerTypes.singleChoiceImage]);

    let singleChoiceImage = null;

	if (!_.isArray(singleChoiceImageWebControl.Data)) {
        return singleChoiceImage;
    }

    if (!_.isArray(singleChoiceImageWebControl.Data[0].question)) {
        return singleChoiceImage;
    }

    let questionData = singleChoiceImageWebControl.Data[0].question[0];
    let answers = getAnswers(questionData.answers[0].answer, imagesStorage);

    if (CommonQuestionData.isSingleChoice(answers)) {
        singleChoiceImage = EntityFactory.SingleChoiceImage(commonQuestionInfo.id, commonQuestionInfo.slideTitle, commonQuestionInfo.parentId, commonQuestionInfo.order);

		singleChoiceImage.updateFeedbacks(CommonQuestionData.getQuestionFeedbacks(questionData));

        _.forEach(answers, answer => {
            singleChoiceImage.addAnswer(answer);
        });

		var questionInstruction = CommonQuestionData.getQuestionInstruction(questionData);

		let contents = [];

		contents = mapContent(wcicData, imagesStorage);

		_.forEach(contents, content => {
			questionInstruction += content.text;
		});

		singleChoiceImage.content = questionInstruction;
        return singleChoiceImage;
    } else {
        return mapInformationContent(slideDetails, wcicData, imagesStorage);
    }
};