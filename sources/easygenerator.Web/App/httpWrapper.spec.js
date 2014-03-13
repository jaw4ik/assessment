define(['httpWrapper'], function (httpWrapper) {
    "use strict";

    var
        http = require('plugins/http'),
        app = require('durandal/app'),
        localizationManager = require('localization/localizationManager'),
        notify = require('notify');

    describe('[httpWrapper]', function () {

        it('should be object', function () {
            expect(httpWrapper).toBeObject();
        });

        describe('post:', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn(http, 'post').and.returnValue(post.promise());
                spyOn(app, 'trigger');
            });

            it('should be function', function () {
                expect(httpWrapper.post).toBeFunction();
            });

            it('should return promise', function () {
                expect(httpWrapper.post()).toBePromise();
            });

            it('should make a post request', function () {
                var url = "url";
                var data = { title: 'title' };

                httpWrapper.post(url, data);

                expect(http.post).toHaveBeenCalledWith(url, data);
            });

            it('should trigger \'httpWrapper:post-begin\' event', function () {
                httpWrapper.post();

                expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-begin');
            });

            describe('when post request failed', function () {

                it('should reject promise with reason', function (done) {
                    var promise = httpWrapper.post();
                    promise.fin(function () {
                        expect(promise).toBeRejectedWith(reason);
                        done();
                    });

                    var reason = "some reason";

                    post.reject(reason);
                });

                it('should trigger \'httpWrapper:post-end\' event', function (done) {
                    var promise = httpWrapper.post();
                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-end');
                        done();
                    });

                    post.reject("some reason");
                });
            });

            describe('when post request succeed', function () {

                it('should trigger \'httpWrapper:post-end\' event', function (done) {
                    var promise = httpWrapper.post();
                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-end');
                        done();
                    });

                    post.resolve();
                });

                describe('and response data is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = httpWrapper.post();
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response data is not an object');
                            done();
                        });

                        post.resolve();
                    });

                });

                describe('and response is an object', function () {

                    describe('and response state is not success', function () {

                        beforeEach(function () {
                            spyOn(notify, 'error');
                        });

                        describe('and response resourceKey exists', function () {

                            beforeEach(function () {
                                spyOn(localizationManager, 'localize').and.returnValue("test localizable value");
                            });

                            it('should reject promise with localizable value', function (done) {
                                var resourceKey = "testResourceKey";
                                var message = "test message";

                                var promise = httpWrapper.post();
                                promise.fin(function () {
                                    expect(localizationManager.localize).toHaveBeenCalledWith(resourceKey);
                                    expect(promise).toBeRejected("test localizable value");
                                    done();
                                });

                                post.resolve({ resourceKey: resourceKey, message: message });
                            });

                            it('should show error notification with localizable value', function (done) {
                                var resourceKey = "testResourceKey";
                                var message = "test message";

                                var promise = httpWrapper.post();
                                promise.fin(function () {
                                    expect(notify.error).toHaveBeenCalledWith("test localizable value");
                                    done();
                                });

                                post.resolve({ resourceKey: resourceKey, message: message });
                            });
                        });

                        describe('and response resourceKey does not exist', function () {

                            describe('and response message exists', function () {

                                it('should reject promise with response message', function (done) {
                                    var message = "test message";

                                    var promise = httpWrapper.post();
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith(message);
                                        done();
                                    });

                                    post.resolve({ message: message });
                                });

                                it('should show error notification with response message', function (done) {
                                    var message = "test message";

                                    var promise = httpWrapper.post();
                                    promise.fin(function () {
                                        expect(notify.error).toHaveBeenCalledWith(message);
                                        done();
                                    });

                                    post.resolve({ message: message });
                                });
                            });

                            describe('and response message does not exist', function () {

                                beforeEach(function () {
                                    spyOn(localizationManager, 'localize').and.returnValue("failed");
                                });

                                it('should show localized default error message', function (done) {
                                    var promise = httpWrapper.post();
                                    promise.fin(function () {
                                        expect(localizationManager.localize).toHaveBeenCalledWith('responseFailed');
                                        done();
                                    });

                                    post.resolve({});
                                });

                                it('should reject promise with default message', function (done) {
                                    var promise = httpWrapper.post();
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('failed');
                                        done();
                                    });

                                    post.resolve({});
                                });

                                it('should show error notification with default message', function (done) {
                                    var promise = httpWrapper.post();
                                    promise.fin(function () {
                                        expect(notify.error).toHaveBeenCalledWith('failed');
                                        done();
                                    });

                                    post.resolve({});
                                });
                            });
                        });
                    });

                    describe('and response state is success', function () {

                        it('should resolve promise with response data', function (done) {
                            var promise = httpWrapper.post();
                            promise.fin(function () {
                                expect(promise).toBeResolvedWith(data);
                                done();
                            });

                            var data = { title: 'title', description: 'description' };

                            post.resolve({ success: true, data: data });
                        });

                    });

                });

            });

        });

    });

});