'use strict';

var Question = require('./Question');

class OpenQuestion extends Question {
    constructor(id, title, objectiveId, order) {
        super(id, title, objectiveId, order);
        this.type = Question.types.OpenQuestion;
    }
}

module.exports = OpenQuestion;