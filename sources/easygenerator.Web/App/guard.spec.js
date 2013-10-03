define(['guard'], function (guard) {
    "use strict";

    describe('[guard]', function () {

        describe('throwIfNotAnObject:', function() {

            describe('when argument is not an object', function() {

                it('should throw exception with message', function () {
                    var message = 'message';
                    var f = function() {
                        guard.throwIfNotAnObject(null, message);
                    };
                    expect(f).toThrow(message);
                });

            });
            
            describe('when argument is an object', function () {

                it('should not throw exception with message', function () {
                    var f = function () {
                        guard.throwIfNotAnObject({}, '');
                    };
                    expect(f).not.toThrow();
                });

            });

        });

        describe('throwIfNotString', function () {
            
            describe('when argument is not a string', function () {

                it('should throw exception with message', function () {
                    var message = 'message';
                    var f = function () {
                        guard.throwIfNotString({}, message);
                    };
                    expect(f).toThrow(message);
                });

            });

            describe('when argument is a string', function () {

                it('should not throw exception with message', function () {
                    var f = function () {
                        guard.throwIfNotString('', '');
                    };
                    expect(f).not.toThrow();
                });

            });
            
        });

        describe('throwIfNotBoolean', function () {

            describe('when argument is not a boolean', function () {

                it('should throw exception with message', function () {
                    var message = 'message';
                    var f = function () {
                        guard.throwIfNotBoolean(undefined, message);
                    };
                    expect(f).toThrow(message);
                });

            });

            describe('when argument is a boolean', function () {

                it('should not throw exception', function () {
                    var f = function () {
                        guard.throwIfNotBoolean(true, '');
                    };
                    expect(f).not.toThrow();
                });

            });

        });

    });
});