'use strict';

var Entity = require('./Entity');

class Course extends Entity {
    constructor(id, title, introduction) {
        super(id, title);
        this.objectives = [];
        this.introduction = introduction;
    }
}

module.exports = Course;