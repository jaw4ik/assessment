'use strict';

var Question = require('./Question');
var TextMatchingAnswer = require('../answers/TextMatchingAnswer');

class TextMatching extends Question {
    constructor(id, title, objectiveId, order) {
        super(id, title, objectiveId, order);
        this.type = Question.types.TextMatching;
        this.answers = [];
    }
    addAnswer(answer) {
        if (answer instanceof TextMatchingAnswer) {
            this.answers.push(answer);
        }
    }
}

module.exports = TextMatching;