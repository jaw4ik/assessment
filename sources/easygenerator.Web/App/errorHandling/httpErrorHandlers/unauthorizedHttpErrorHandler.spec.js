define(['errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler', 'plugins/router'], function (errorHandler, router) {
    "use strict";

    describe('[unauthorizedHttpErrorHandler]', function () {

        describe('handleError:', function () {

            beforeEach(function () {
                spyOn(router, 'setLocation');
            });

            it('should be function', function () {
                expect(errorHandler.handleError).toBeFunction();
            });

            it('should call router setLocation with \'~/signin\'', function () {
                errorHandler.handleError();
                expect(router.setLocation).toHaveBeenCalledWith('/signin');
            });

        });

    });
});