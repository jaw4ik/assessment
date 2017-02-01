'use strict';

var uniqueGenerator = require('../../utils/uniqueGenerator');

class UserGenerator {
    get uniqueUser() {
        return {
            firstName: uniqueGenerator.str,
            lastName: uniqueGenerator.str,
            email: uniqueGenerator.email,
            password: uniqueGenerator.str
        }
    }
}

module.exports = new UserGenerator();