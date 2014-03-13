define(['bootstrapping/errorHandlingTask'], function (task) {
    "use strict";

    var
        errorHandlingConfiguration = require('errorHandling/errorHandlingConfiguration'),
        globalErrorHandler = require('errorHandling/globalErrorHandler');

    describe('task [errorHandlingTask]', function () {

        describe('execute:', function () {

            beforeEach(function () {
                spyOn(errorHandlingConfiguration, 'configure');
                spyOn(globalErrorHandler, 'subscribeOnAjaxErrorEvents');
            });

            it('should configure error handling', function () {
                task.execute();

                expect(errorHandlingConfiguration.configure).toHaveBeenCalled();
            });

            it('should subscribe on ajax error events', function () {
                task.execute();

                expect(globalErrorHandler.subscribeOnAjaxErrorEvents).toHaveBeenCalled();
            });

        });

    });

});