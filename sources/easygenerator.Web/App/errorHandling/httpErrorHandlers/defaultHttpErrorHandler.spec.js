define(['errorHandling/httpErrorHandlers/defaultHttpErrorHandler'], function (errorHandler) {
    "use strict";

    var
        localizationManager = require('localization/localizationManager'),
        notify = require('notify');

    describe('[defaultHttpErrorHandler]', function () {

        describe('handleError:', function () {

            var defaultErrorNotification = 'failed';

            beforeEach(function () {
                spyOn(notify, 'error');
                spyOn(localizationManager, 'localize').and.returnValue(defaultErrorNotification);
            });

            describe('and response is undefined', function () {

                it('should show default error notification', function () {
                    errorHandler.handleError();
                    expect(notify.error).toHaveBeenCalledWith(defaultErrorNotification);
                });

            });

            describe('and response is string', function () {

                it('should show error notification with response', function () {
                    var response = 'message';
                    errorHandler.handleError(response);
                    expect(notify.error).toHaveBeenCalledWith(response);
                });

            });

            describe('and response is not-string object', function () {

                it('should show default error notification', function () {
                    errorHandler.handleError({ value: '100500' });
                    expect(notify.error).toHaveBeenCalledWith(defaultErrorNotification);
                });
                
            });

        });

    });
});