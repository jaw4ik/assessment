'use strict';

var Answer = require('./Answer');

class BlankAnswer extends Answer {
    constructor(text, isCorrect, groupId, matchCase) {
        super(text, isCorrect);
        this.groupId = groupId;
        this.matchCase = matchCase;
    }
}

module.exports = BlankAnswer;