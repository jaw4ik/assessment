define(['errorHandling/serviceUnavailabeErrorHandler', 'plugins/router'], function (errorHandler, router) {
    "use strict";

    describe('[serviceUnavailabeErrorHandler]', function () {

        describe('subscribeOnGlobalErrorEvents:', function () {

            var ajaxErrorHandler;
            beforeEach(function () {
                spyOn(router, 'reloadLocation');
                spyOn($.fn, 'ajaxError').andCallFake(function (arg) {
                    ajaxErrorHandler = arg;
                });
            });

            it('should be function', function () {
                expect(errorHandler.subscribeOnGlobalErrorEvents).toBeFunction();
            });

            describe('and when document ajax error triggered', function () {

                beforeEach(function() {
                    errorHandler.subscribeOnGlobalErrorEvents();
                });

                describe('and when response in null', function () {
                    it('should not call router reloadLocation', function () {
                        ajaxErrorHandler(null, null);
                        expect(router.reloadLocation).not.toHaveBeenCalled();
                    });
                });

                describe('and when response is defined', function () {

                    describe('and when response status is 503', function () {
                        it('should call router reloadLocation', function () {
                            ajaxErrorHandler({}, { status: 503 });
                            expect(router.reloadLocation).toHaveBeenCalled();
                        });
                    });
                    
                });

            });

        });

    });
});