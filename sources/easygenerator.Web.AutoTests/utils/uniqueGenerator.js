'use strict';

var uuid = require('node-uuid');
const PREFIX = 'autotest';

module.exports = {
    get guid() {
        return uuid.v4().split('-').join('');
    },
    get str() {
        return `${PREFIX}${this.guid}`;
    },
    get email() {
        return `${PREFIX}${this.guid}@easygenerator.com`;
    }
}