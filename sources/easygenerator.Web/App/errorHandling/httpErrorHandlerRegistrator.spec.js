define(['errorHandling/httpErrorHandlerRegistrator'], function (errorHandlerRegistrator) {
    "use strict";

    describe('[httpErrorHandlerRegistrator]', function () {

        describe('registeredHandlers:', function () {

            it('should be defined', function () {
                expect(errorHandlerRegistrator.registeredHandlers).toBeDefined();
            });

        });

        describe('registerHandler:', function () {

            it('should be function', function () {
                expect(errorHandlerRegistrator.registerHandler).toBeFunction();
            });

            describe('when there is alredy handler with this status code registered', function () {

                beforeEach(function () {
                    errorHandlerRegistrator.registeredHandlers = {};
                    errorHandlerRegistrator.registeredHandlers[500] = {};
                });

                it('should throw with \'Error handler for status code 500 has already been registered.\'', function () {
                    var f = function () {
                        errorHandlerRegistrator.registerHandler(500, {});
                    };

                    expect(f).toThrow('Error handler for status code 500 has already been registered.');
                });

            });

            describe('when handler doesn expose handleError() method', function () {

                beforeEach(function () {
                    errorHandlerRegistrator.registeredHandlers = {};
                });

                it('should throw with \'Error handler has to expose \'handleError()\' method\'', function () {
                    var f = function () {
                        errorHandlerRegistrator.registerHandler(100, {});
                    };

                    expect(f).toThrow('Error handler has to expose \'handleError()\' method');
                });

            });

            describe('when no handler with this status code registered and handler exposes handleError() method', function () {

                beforeEach(function () {
                    errorHandlerRegistrator.registeredHandlers = {};
                });

                it('should register error handler', function () {
                    var handler = { handleError: function () { } };
                    errorHandlerRegistrator.registerHandler(200, handler);

                    expect(errorHandlerRegistrator.registeredHandlers[200]).toBe(handler);
                });

            });
        });

    });

});