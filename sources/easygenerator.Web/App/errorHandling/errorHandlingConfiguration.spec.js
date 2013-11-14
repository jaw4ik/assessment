define(['errorHandling/errorHandlingConfiguration', 'errorHandling/httpErrorHandlerRegistrator', 'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler', 'errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler'],
    function (configuration, errorHandlerRegistrator, serviceUnavailableHttpErrorHandler, unauthorizedHttpErrorHandler) {

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

                it('should register serviceUnavailableHttpErrorHandler for 503 error', function () {
                    configuration.configure();
                    expect(errorHandlerRegistrator.registerHandler).toHaveBeenCalledWith(503, serviceUnavailableHttpErrorHandler);
                });
            });

        });
    });