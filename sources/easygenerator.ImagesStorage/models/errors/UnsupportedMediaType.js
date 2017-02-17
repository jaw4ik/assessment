'use strict';

var HttpError = require('./HttpError');
var constants = require('../../constants');

class UnsupportedMediaTypeHttpError extends HttpError {
    constructor() {
        super(415, constants.errors.unsupportedMediaType);
    }
}

module.exports = UnsupportedMediaTypeHttpError;