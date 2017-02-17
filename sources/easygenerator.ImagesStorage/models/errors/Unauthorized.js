'use strict';

var HttpError = require('./HttpError');
var constants = require('../../constants');

class Unauthorized extends HttpError {
    constructor() {
        super(401, constants.errors.unauthorized);
    }
}

module.exports = Unauthorized;