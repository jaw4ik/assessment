'use strict';

var uuid = require('uuid/v4');
const PREFIX = 'autotest';

module.exports = {
    get guid() {
        return uuid().split('-').join('');
    },
    get str() {
        return `${PREFIX}${this.guid}`;
    },
    get email() {
        return `${PREFIX}${this.guid}@easygenerator.com`;
    }
}