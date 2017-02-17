'use strict';

var HttpError = require('./HttpError');
var PayloadTooLarge = require('./PayloadTooLarge');
var UnsupportedMediaType = require('./UnsupportedMediaType');
var BadRequest = require('./BadRequest');
var Unauthorized = require('./Unauthorized');
var NotFound = require('./NotFound');

class ErrorsFactory{
    static httpError(statusCode, message) {
        return new HttpError(statusCode, message);
    }
    static payloadTooLarge() {
        return new PayloadTooLarge();
    }
    static unsupportedMediaType() {
        return new UnsupportedMediaType();
    }
    static badRequest() {
        return new BadRequest();
    }
    static unauthorized() {
        return new Unauthorized();
    }
    static notFound(){
        return new NotFound();
    }
}

module.exports = ErrorsFactory;