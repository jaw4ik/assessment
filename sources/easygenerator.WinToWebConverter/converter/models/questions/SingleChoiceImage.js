'use strict';

var Question = require('./Question');
var SingleChoiceImageAnswer = require('../answers/SingleChoiceImageAnswer');

class SingleChoiceImage extends Question {
    constructor(id, title, objectiveId, order) {
        super(id, title, objectiveId, order);
        this.type = Question.types.SingleSelectImage
        this.answers = [];
    }
    addAnswer(answer) {
        if (answer instanceof SingleChoiceImageAnswer) {
            this.answers.push(answer);
        }
    }
}

module.exports = SingleChoiceImage;