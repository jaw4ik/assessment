'use strict';

var Entity = require('../Entity');
var constants = require('../../constants');
var _ = require('lodash');

class Question extends Entity {
    constructor(id, title, objectiveId, order) {
		super(id, title);
        this.objectiveId = objectiveId;
        this.order = parseInt(order);
        this.incorrectFeedback = '';
        this.correctFeedback = '';
        this.learningContents = [];
        this.type = '';
        this.content = '';
    }
    static get types() {
        return constants.webQuestionTypes;
    }
	updateFeedbacks(feedbacks) {
	    if (!_.isObject(feedbacks)) {
	        return;
		}

		if (_.isString(feedbacks.correctFeedback)) {
		    this.correctFeedback = feedbacks.correctFeedback;
		}

		if (_.isString(feedbacks.incorrectFeedback)) {
		    this.incorrectFeedback = feedbacks.incorrectFeedback;
		}
	}
}

module.exports = Question;