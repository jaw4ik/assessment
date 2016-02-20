import configuration from './errorHandlingConfiguration';

import errorHandlerRegistrator from 'errorHandling/httpErrorHandlerRegistrator';
import serviceUnavailableHttpErrorHandler from 'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler';
import unauthorizedHttpErrorHandler from 'errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler';
import forbiddenHttpErrorHandler from 'errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler';

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
