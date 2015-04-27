define(['errorHandling/errorHandlingConfiguration'], function (configuration) {
    "use strict";

    var
        errorHandlerRegistrator = require('errorHandling/httpErrorHandlerRegistrator'),
        serviceUnavailableHttpErrorHandler = require('errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler'),
        unauthorizedHttpErrorHandler = require('errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler'),
        forbiddenHttpErrorHandler = require('errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler');

    describe('[errorHandlingConfiguration]', function () {

        describe('configure', function () {

            beforeEach(function () {
                spyOn(errorHandlerRegistrator, 'registerHandler');
            });

            it('should be function', function () {
                expect(configuration.configure).toBeFunction();
            });

            it('should register unauthorizedHttpErrorHandler for 401 error', function () {
                configuration.configure();
                expect(errorHandlerRegistrator.registerHandler).toHaveBeenCalledWith(401, unauthorizedHttpErrorHandler);
            });

            it('should register forbiddenHttpErrorHandler for 403 error', function () {
                configuration.configure();
                expect(errorHandlerRegistrator.registerHandler).toHaveBeenCalledWith(403, forbiddenHttpErrorHandler);
            });

            it('should register serviceUnavailableHttpErrorHandler for 503 error', function () {
                configuration.configure();
                expect(errorHandlerRegistrator.registerHandler).toHaveBeenCalledWith(503, serviceUnavailableHttpErrorHandler);
            });
        });

    });
});