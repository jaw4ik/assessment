define(['errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler'], function (errorHandler) {
    "use strict";

    var
        router = require('plugins/router');

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