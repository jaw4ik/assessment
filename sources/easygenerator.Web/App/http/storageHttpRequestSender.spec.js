define(['http/httpRequestSender'], function (httpRequestSender) {
    "use strict";

    var
        http = require('plugins/http'),
        localizationManager = require('localization/localizationManager');

    describe('[httpRequestSender]', function () {

        it('should be object', function () {
            expect(httpRequestSender).toBeObject();
        });

        describe('post:', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn(http, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(httpRequestSender.post).toBeFunction();
            });

            it('should return promise', function () {
                expect(httpRequestSender.post()).toBePromise();
            });

            it('should make a post request', function () {
                var url = "url";
                var data = { title: 'title' };
                var headers = { auth: 'auth' };

                httpRequestSender.post(url, data, headers);

                expect(http.post).toHaveBeenCalledWith(url, data, headers);
            });

            describe('when post request failed', function () {

                it('should reject promise with reason', function (done) {
                    var promise = httpRequestSender.post();
                    promise.fin(function () {
                        expect(promise).toBeRejectedWith(reason);
                        done();
                    });

                    var reason = "some reason";

                    post.reject(reason);
                });
            });

            describe('when post request succeed', function () {

                describe('and response data is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = httpRequestSender.post();
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response data is not an object');
                            done();
                        });

                        post.resolve();
                    });

                });

                describe('and response is an object', function () {

                    describe('and response state is not success', function () {

                        describe('and response resourceKey exists', function () {

                            beforeEach(function () {
                                spyOn(localizationManager, 'localize').and.returnValue("test localizable value");
                            });

                            it('should resolve promise with localizable value', function (done) {
                                var resourceKey = "testResourceKey";
                                var message = "test message";

                                var promise = httpRequestSender.post();
                                promise.fin(function () {
                                    expect(localizationManager.localize).toHaveBeenCalledWith(resourceKey);
                                    expect(promise).toBeResolvedWith({ success: false, errorMessage: "test localizable value" });
                                    done();
                                });

                                post.resolve({ resourceKey: resourceKey, message: message });
                            });
                        });

                        describe('and response resourceKey does not exist', function () {

                            describe('and response message exists', function () {

                                it('should resolved promise with response message', function (done) {
                                    var message = "test message";

                                    var promise = httpRequestSender.post();
                                    promise.fin(function () {
                                        expect(promise).toBeResolvedWith({ success: false, errorMessage: message });
                                        done();
                                    });

                                    post.resolve({ message: message });
                                });
                            });

                            describe('and response message does not exist', function () {

                                beforeEach(function () {
                                    spyOn(localizationManager, 'localize').and.returnValue("failed");
                                });

                                it('should resolve promise with default message', function (done) {
                                    var promise = httpRequestSender.post();
                                    promise.fin(function () {
                                        expect(promise).toBeResolvedWith({ success: false, errorMessage: "failed" });
                                        done();
                                    });

                                    post.resolve({});
                                });
                            });
                        });
                    });

                    describe('and response state is success', function () {

                        it('should resolve promise with response', function (done) {
                            var promise = httpRequestSender.post();
                            promise.fin(function () {
                                expect(promise).toBeResolvedWith(data);
                                done();
                            });

                            var data = { success: true, data: data };

                            post.resolve(data);
                        });

                    });

                });

            });

        });

        describe('get:', function () {
            it('should be function', function () {
                expect(httpRequestSender.get).toBeFunction();
            });

            it('should return promise', function () {
                expect(httpRequestSender.get()).toBePromise();
            });
        });
    });
});