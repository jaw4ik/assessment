'use strict';

var Entity = require('./Entity');

class Objective extends Entity {
    constructor(id, title, order) {
        super(id, title);
        this.questions = [];
        this.order = parseInt(order);
    }
}

module.exports = Objective;