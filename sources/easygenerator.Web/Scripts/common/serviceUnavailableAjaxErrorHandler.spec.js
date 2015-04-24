define([], function () {
    "use strict";

    describe('[serviceUnavailableErrorHandler]', function () {
        var errorHandler;

        beforeEach(function () {
            errorHandler = serviceUnavailableAjaxErrorHandler();
        });

        describe('subscribeOnGlobalErrorEvents:', function () {

            var ajaxErrorHandler;
            beforeEach(function () {
                spyOn(app, 'reload');
                spyOn($.fn, 'ajaxError').and.callFake(function (arg) {
                    ajaxErrorHandler = arg;
                });
            });

            it('should be function', function () {
                expect(errorHandler.subscribeOnGlobalErrorEvents).toBeFunction();
            });

            describe('and when document ajax error triggered', function () {

                beforeEach(function () {
                    errorHandler.subscribeOnGlobalErrorEvents();
                });

                describe('and when response in null', function () {
                    it('should not call app reload', function () {
                        ajaxErrorHandler(null, null);
                        expect(app.reload).not.toHaveBeenCalled();
                    });
                });

                describe('and when response is defined', function () {

                    describe('and when response status is 503', function () {
                        it('should call app reload', function () {
                            ajaxErrorHandler({}, { status: 503 });
                            expect(app.reload).toHaveBeenCalled();
                        });
                    });

                });

            });

        });

    });
});