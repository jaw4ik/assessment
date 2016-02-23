'use strict';

var Question = require('./Question');

class InformationContent extends Question {
    constructor(id, title, objectiveId, order) {
        super(id, title, objectiveId, order);
        this.type = Question.types.InformationContent;
    }
}

module.exports = InformationContent;