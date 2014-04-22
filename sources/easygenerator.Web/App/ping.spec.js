define(['ping'], function (ping) {
    "use strict";

    describe('[ping]', function () {

        var dfd;

        beforeEach(function () {
            dfd = $.Deferred();
            spyOn($, 'post').and.returnValue(dfd.promise());
        });

        it('should be object', function () {
            expect(ping).toBeObject();
        });

        describe('execute:', function () {

            it('should be function', function () {
                expect(ping.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(ping.execute()).toBePromise();
            });

            it('should send post request', function () {
                ping.execute();
                expect($.post).toHaveBeenCalled();
            });

            describe('when request succeed', function () {

                beforeEach(function () {
                    dfd.resolve();
                });

                it('should resolve promise', function (done) {
                    var promise = ping.execute();
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(true);
                        done();
                    });
                });

            });

            describe('when request failed', function () {

                beforeEach(function () {
                    dfd.reject();
                });

                it('should reject promise', function (done) {
                    var promise = ping.execute();
                    promise.fin(function () {
                        expect(promise).toBeRejected();
                        done();
                    });
                });

            });
        });

    });
})