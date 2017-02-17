'use strict';

var HttpError = require('./HttpError');
var constants = require('../../constants');

class NotFound extends HttpError {
    constructor() {
        super(404, constants.errors.notFound);
    }
}

module.exports = NotFound;