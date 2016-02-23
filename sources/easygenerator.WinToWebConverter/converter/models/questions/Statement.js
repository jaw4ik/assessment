'use strict';

var Question = require('./Question');
var Answer = require('../answers/Answer');

class Statement extends Question {
    constructor(id, title, objectiveId, order) {
        super(id, title, objectiveId, order);
        this.type = Question.types.Statement;
        this.answers = [];
    }
    addAnswer(answer) {
        if (answer instanceof Answer) {
            this.answers.push(answer);
        }
    }
}

module.exports = Statement;