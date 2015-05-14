define(['errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler', 'plugins/router'], function (errorHandler, router) {
    "use strict";

    describe('[serviceUnavailableHttpErrorHandler]', function () {

        describe('handleError:', function () {

            beforeEach(function () {
                spyOn(router, 'reloadLocation');
                spyOn(router, 'reset');
            });

            it('should be function', function () {
                expect(errorHandler.handleError).toBeFunction();
            });

            it('should reset router', function () {
                errorHandler.handleError();
                expect(router.reset).toHaveBeenCalled();
            });

            it('should call router reloadLocation', function () {
                errorHandler.handleError();
                expect(router.reloadLocation).toHaveBeenCalled();
            });

        });

    });
});