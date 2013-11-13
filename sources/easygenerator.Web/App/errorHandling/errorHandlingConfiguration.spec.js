define(['errorHandling/errorHandlingConfiguration', 'errorHandling/httpErrorHandlerRegistrator', 'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler'],
    function (configuration, errorHandlerRegistrator, serviceUnavailableHttpErrorHandler) {

        describe('[errorHandlingConfiguration]', function () {

            describe('configure', function () {

                beforeEach(function () {
                    spyOn(errorHandlerRegistrator, 'registerHandler');
                });

                it('should be function', function () {
                    expect(configuration.configure).toBeFunction();
                });

                it('should register serviceUnavailableHttpErrorHandler for 503 error', function () {
                    configuration.configure();
                    expect(errorHandlerRegistrator.registerHandler).toHaveBeenCalledWith(503, serviceUnavailableHttpErrorHandler);
                });

            });

        });
    });