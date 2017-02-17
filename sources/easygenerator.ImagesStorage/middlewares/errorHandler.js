'use strict';

var constants = require('../constants');
var HttpError = require('../models/errors/HttpError');
var ErrorsFactory = require('../models/errors');


module.exports = (err, req, res, next) => {
    let status = 500;
    let message = constants.errors.internalServerError;

    if (err.code === 'LIMIT_FILE_SIZE') { //multer error code
        err = ErrorsFactory.payloadTooLarge();
        status = err.status;
        message = err.message;
    }

    if (err instanceof HttpError) {
        status = err.statusCode;
        message = err.message;
    }

    res.status(status).send(message);
    next(err);
}