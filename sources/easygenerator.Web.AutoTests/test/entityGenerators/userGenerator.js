'use strict';

var uniqueGenerator = require('../../utils/uniqueGenerator');

class UserGenerator {
    get uniqueUser() {
        return {
            firstName: uniqueGenerator.str,
            lastName: uniqueGenerator.str,
            email: uniqueGenerator.email,
            password: uniqueGenerator.str,
            country: 'Ukraine',
            phone: uniqueGenerator.str,
            role: 'Other'
        }
    }
}

module.exports = new UserGenerator();