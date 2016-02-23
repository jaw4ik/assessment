'use strict';

var Question = require('./Question');
var BlankAnswer = require('../answers/BlankAnswer');

class FillInTheBlanks extends Question {
    constructor(id, title, objectiveId, order) {
        super(id, title, objectiveId, order);
        this.type = Question.types.FillInTheBlanks;
        this.answers = [];
    }
    addAnswer(answer) {
        if (answer instanceof BlankAnswer) {
            this.answers.push(answer);
        }
    }
}

module.exports = FillInTheBlanks;