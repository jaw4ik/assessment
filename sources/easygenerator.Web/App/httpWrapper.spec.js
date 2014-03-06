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
                    promise.fin(done);

                    var reason = "reason";

                    post.reject(reason);

                    expect(promise).toBeRejectedWith(reason);
                });

                it('should trigger \'httpWrapper:post-end\' event', function (done) {
                    var promise = httpWrapper.post();
                    promise.fin(done);

                    post.reject();

                    expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-end');
                });
            });

            describe('when post request succeed', function () {

                it('should trigger \'httpWrapper:post-end\' event', function (done) {
                    var promise = httpWrapper.post();
                    promise.fin(done);

                    post.resolve();

                    expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-end');
                });

                describe('and response data is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = httpWrapper.post();
                        promise.fin(done);

                        post.resolve();

                        expect(promise).toBeRejectedWith('Response data is not an object');
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
                                promise.fin(done);

                                post.resolve({ resourceKey: resourceKey, message: message });

                                expect(localizationManager.localize).toHaveBeenCalledWith(resourceKey);
                                expect(promise).toBeRejected("test localizable value");
                            });

                            it('should show error notification with localizable value', function (done) {
                                var resourceKey = "testResourceKey";
                                var message = "test message";

                                var promise = httpWrapper.post();
                                promise.fin(done);

                                post.resolve({ resourceKey: resourceKey, message: message });

                                expect(notify.error).toHaveBeenCalledWith("test localizable value");
                            });
                        });

                        describe('and response resourceKey does not exist', function () {

                            describe('and response message exists', function () {

                                it('should reject promise with response message', function (done) {
                                    var message = "test message";

                                    var promise = httpWrapper.post();
                                    promise.fin(done);

                                    post.resolve({ message: message });

                                    expect(promise).toBeRejectedWith(message);
                                });

                                it('should show error notification with response message', function (done) {
                                    var message = "test message";

                                    var promise = httpWrapper.post();
                                    promise.fin(done);

                                    post.resolve({ message: message });

                                    expect(notify.error).toHaveBeenCalledWith(message);
                                });
                            });

                            describe('and response message does not exist', function () {

                                beforeEach(function () {
                                    spyOn(localizationManager, 'localize').and.returnValue("failed");
                                });

                                it('should show localized default error message', function (done) {
                                    var promise = httpWrapper.post();
                                    promise.fin(done);

                                    post.resolve({});

                                    expect(localizationManager.localize).toHaveBeenCalledWith('responseFailed');
                                });

                                it('should reject promise with default message', function (done) {
                                    var promise = httpWrapper.post();
                                    promise.fin(done);

                                    post.resolve({});

                                    expect(promise).toBeRejectedWith('failed');
                                });

                                it('should show error notification with default message', function (done) {
                                    var promise = httpWrapper.post();
                                    promise.fin(done);

                                    post.resolve({});

                                    expect(notify.error).toHaveBeenCalledWith('failed');
                                });
                            });
                        });
                    });

                    describe('and response state is success', function () {

                        it('should resolve promise with response data', function (done) {
                            var promise = httpWrapper.post();
                            promise.fin(done);

                            var data = { title: 'title', description: 'description' };

                            post.resolve({ success: true, data: data });

                            expect(promise).toBeResolvedWith(data);
                        });

                    });

                });

            });

        });

    });

});