'use strict';

var Question = require('./Question');
var Answer = require('../answers/Answer');

class MultipleChoice extends Question {
    constructor(id, title, objectiveId, order) {
        super(id, title, objectiveId, order);
        this.type = Question.types.MultipleSelect;
        this.answers = [];
    }
    addAnswer(answer) {
        if (answer instanceof Answer) {
            this.answers.push(answer);
        }
    }
}

module.exports = MultipleChoice;