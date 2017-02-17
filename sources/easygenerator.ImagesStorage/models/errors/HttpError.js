'use strict';

var constants = require('../../constants');

class HttpError extends Error{
    constructor(statusCode = 500, message = constants.errors.internalServerError) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'HttpError';
    }
}

module.exports = HttpError;