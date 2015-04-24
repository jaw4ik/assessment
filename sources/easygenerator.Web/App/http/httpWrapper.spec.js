define(['http/httpWrapper'], function (httpWrapper) {
    "use strict";

    var
        http = require('http/httpRequestSender'),
        app = require('durandal/app'),
        notify = require('notify');

    describe('[httpWrapper]', function () {

        it('should be object', function () {
            expect(httpWrapper).toBeObject();
        });

        describe('post:', function () {

            var post;

            beforeEach(function () {
                post = Q.defer();
                spyOn(http, 'post').and.returnValue(post.promise);
                spyOn(app, 'trigger');
            });

            it('should be function', function () {
                expect(httpWrapper.post).toBeFunction();
            });

            it('should return promise', function () {
                expect(httpWrapper.post()).toBePromise();
            });

            it('should trigger \'httpWrapper:post-begin\' event', function () {
                httpWrapper.post();

                expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-begin');
            });

            it('should make a post request', function () {
                var url = "url";
                var data = { title: 'title' };

                httpWrapper.post(url, data);

                expect(http.post).toHaveBeenCalledWith(url, data);
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
                        var message = "test message";

                        beforeEach(function () {
                            spyOn(notify, 'error');
                        });

                        it('should reject promise with response message', function (done) {
                            var promise = httpWrapper.post();
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(message);
                                done();
                            });

                            post.resolve({ success: false, errorMessage: message });
                        });

                        it('should show error notification with error message', function (done) {
                            var promise = httpWrapper.post();
                            promise.fin(function () {
                                expect(notify.error).toHaveBeenCalledWith(message);
                                done();
                            });

                            post.resolve({ success: false, errorMessage: message });
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

            describe('when post request failed', function () {

                it('should trigger \'httpWrapper:post-end\' event', function (done) {
                    var promise = httpWrapper.post();
                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-end');
                        done();
                    });

                    post.reject();
                });

            });

        });

    });

});