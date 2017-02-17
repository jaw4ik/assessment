'use strict';

var HttpError = require('./HttpError');
var constants = require('../../constants');

class PayloadTooLargeHttpError extends HttpError {
    constructor() {
        super(413, constants.errors.payloadTooLarge);
    }
}

module.exports = PayloadTooLargeHttpError;