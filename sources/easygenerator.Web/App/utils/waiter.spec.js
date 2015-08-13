define(['utils/waiter'], function (waiter) {
    "use strict";

    describe('[waiter]', function () {

        it('should be defined', function () {
            expect(waiter).toBeDefined();
        });

        describe('waitFor', function () {

            it('should be function', function () {
                expect(waiter.waitFor).toBeFunction();
            });

            describe('when predicate is not function', function () {

                it('should throw error', function () {
                    expect(function () { waiter.waitFor(null, 100, 100); }).toThrow();
                });

            });

            describe('when delay is not positive number', function () {

                it('should throw error', function () {
                    expect(function () { waiter.waitFor(function () { return true; }, null, 100); }).toThrow();
                });

            });

            describe('when limit is not positive number', function () {

                it('should throw error', function () {
                    expect(function () { waiter.waitFor(function () { return true; }, 100, null); }).toThrow();
                });

            });

            describe('when all parameters are correct', function () {

                beforeEach(function () {
                    jasmine.clock().install();
                });

                afterEach(function () {
                    jasmine.clock().uninstall();
                });

                it('should return promise', function () {
                    expect(waiter.waitFor(function () { return true; }, 100, 100)).toBePromise();
                });

                describe('and predicate is truthy', function () {

                    it('should resolve promise', function () {
                        var promise = waiter.waitFor(function () { return true; }, 100, 10);
                        jasmine.clock().tick(100);
                        expect(promise).toBeResolved();
                    });

                });

                describe('and predicate is falsy', function () {

                    describe('and predicate became truthy before time limit', function () {

                        it('should resolve promise', function () {
                            var value = false,
                                predicate = function () {
                                    return value;
                                }
                            var promise = waiter.waitFor(predicate, 100, 100);
                            setTimeout(function () {
                                value = true;
                            }, 1000);

                            jasmine.clock().tick(1500);
                            expect(promise).toBeResolved();
                        });

                    });

                    describe('and time is up', function () {

                        it('should reject promise', function () {
                            var value = false,
                                predicate = function () {
                                    return value;
                                }
                            var promise = waiter.waitFor(predicate, 100, 10);
                            setTimeout(function () {
                                value = true;
                            }, 1500);

                            jasmine.clock().tick(1500);
                            expect(promise).toBeRejected();
                        });

                    });

                });

            });

        });

        describe('waitTime', function() {

            it('should be function', function() {
                expect(waiter.waitTime).toBeFunction();
            });

            it('should return promise', function () {
                expect(waiter.waitTime(100)).toBePromise();
            });

            describe('when time is not positive number', function() {

                it('should throw error', function () {
                    expect(function() { waiter.waitTime(-25); }).toThrow();
                });

            });

            describe('when time is a positive number', function() {

                beforeEach(function() {
                    jasmine.clock().install();
                });

                afterEach(function() {
                    jasmine.clock().uninstall();
                });

                it('should resolve promise after time is end', function() {
                    var promise = waiter.waitTime(100);
                    jasmine.clock().tick(150);
                    expect(promise).toBeResolved();
                });

            });

        });

    });

});