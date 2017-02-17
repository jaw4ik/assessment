'use strict';

var HttpError = require('./HttpError');
var constants = require('../../constants');

class BadRequest extends HttpError {
    constructor() {
        super(400, constants.errors.badRequest);
    }
}

module.exports = BadRequest;