'use strict';

var _ = require('lodash');

class CommonQuestionData {
    static getQuestionInstruction(questionData) {
        let instruction = '';

        if (!_.isObject(questionData)) {
            return instruction;
        }

        if (_.isArray(questionData.title) && !_.isEmpty(questionData.title[0])) {
            instruction += `<h1>${questionData.title[0]}</h1>`;
        }

		if (_.isArray(questionData.body) && !_.isEmpty(questionData.body[0])) {
			instruction += `<p>${questionData.body[0]}</p>`;
		}

        return instruction;
    }
	static getSlideType(slideDetails) {
		if (_.isObject(slideDetails) && _.isArray(slideDetails.SlideType)) {
			return slideDetails.SlideType[0];
		}
		return null;
	}
	static getPageTemplate(slideDetails) {
		if (_.isObject(slideDetails) && _.isArray(slideDetails.PageTemplate)) {
			return slideDetails.PageTemplate[0];
		}
		return null;
	}
	static getCommonQuestionInfo(slideDetails) {
		let commonData = {
			id: '',
			parentId: '',
			slideTitle: '',
			order: 0
		};

		if (!_.isObject(slideDetails) && !_.isArray(slideDetails.Node)) {
			return commonData;
		}

		let node = slideDetails.Node[0];

		if (_.isArray(node.Id)) {
			commonData.id = node.Id[0];
		}

		if (_.isArray(node.ParentId)) {
			commonData.parentId = node.ParentId[0];
		}

		if (_.isArray(node.MenuLabel)) {
			commonData.slideTitle = node.MenuLabel[0];
		}

		if (_.isArray(node.Position)) {
			commonData.order = node.Position[0];
		}

		return commonData;
	}
	static getQuestionWebControl(wcicData, controlTypes) {
		let questionWebControl = null;
		if (!_.isObject(wcicData) || !_.isObject(wcicData.WebControlInfoCollection) || !_.isArray(wcicData.WebControlInfoCollection.WebControlInfo)) {
			return questionWebControl;
		}

		questionWebControl = _.find(wcicData.WebControlInfoCollection.WebControlInfo, webControl => {
			let controllerType = webControl.ControllerType[0];
			return _.some(controlTypes, control => {
				return controllerType === control;
			});
		});
        return questionWebControl;
	}
	static isSingleChoice(answers) {
		let correctAnswers = _.filter(answers, answer => answer.isCorrect);
		return correctAnswers.length === 1;
	}
	static getQuestionFeedbacks(questionData) {
	    let feedback = {
			correctFeedback: '',
			incorrectFeedback: ''
	    };

		if (!_.isObject(questionData)) {
            return feedback;
        }

		if (!_.isArray(questionData.feedback)) {
		    return feedback;
		}

		if (_.isArray(questionData.feedback[0].correct) && _.isString(questionData.feedback[0].correct[0])) {
		    feedback.correctFeedback = questionData.feedback[0].correct[0];
		}

		if (_.isArray(questionData.feedback[0].incorrect) && _.isString(questionData.feedback[0].incorrect[0])) {
			feedback.incorrectFeedback = questionData.feedback[0].incorrect[0];
		}

	    return feedback;

	}
}

module.exports = CommonQuestionData;