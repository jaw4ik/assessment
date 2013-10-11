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
                spyOn(http, 'post').andReturn(post.promise());
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
                beforeEach(function() {
                    spyOn(notify, 'error');
                });

                it('should reject promise', function () {
                    var promise = httpWrapper.post();
                    var reason = "reason";

                    post.reject(reason);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith(reason);
                    });
                });

                it('should show error notification', function() {
                    var promise = httpWrapper.post();
                    var reason = "reason";

                    post.reject(reason);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(notify.error).toHaveBeenCalledWith(reason);
                    });
                });

                it('should trigger \'httpWrapper:post-end\' event', function () {
                    var promise = httpWrapper.post();
                    post.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-end');
                    });
                });
            });

            describe('when post request succeed', function () {

                it('should trigger \'httpWrapper:post-end\' event', function () {
                    var promise = httpWrapper.post();
                    post.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(app.trigger).toHaveBeenCalledWith('httpWrapper:post-end');
                    });
                });

                describe('and response data is not an object', function () {

                    it('should reject promise', function () {
                        var promise = httpWrapper.post();

                        post.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Response data is not an object');
                        });
                    });

                });

                describe('and response is an object', function () {

                    describe('and response state is not success', function () {
                        beforeEach(function () {
                            spyOn(notify, 'error');
                        });

                        describe('and response resourceKey exists', function () {
                            beforeEach(function() {
                                spyOn(localizationManager, 'localize').andReturn("test localizable value");
                            });
                            
                            it('should reject promise with localizable value', function () {
                                var resourceKey = "testResourceKey";
                                var message = "test message";
                                
                                var promise = httpWrapper.post();

                                post.resolve({ resourceKey: resourceKey, message: message });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(localizationManager.localize).toHaveBeenCalledWith(resourceKey);
                                    expect(promise).toBeRejected("test localizable value");
                                });
                            });

                            it('should show error notification with localizable value', function() {
                                var resourceKey = "testResourceKey";
                                var message = "test message";

                                var promise = httpWrapper.post();

                                post.resolve({ resourceKey: resourceKey, message: message });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(notify.error).toHaveBeenCalledWith("test localizable value");
                                });
                            });
                        });

                        describe('and response resourceKey does not exist', function () {

                            describe('and response message exists', function () {

                                it('should reject promise with response message', function () {
                                    var message = "test message";

                                    var promise = httpWrapper.post();

                                    post.resolve({ message: message });

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith(message);
                                    });
                                });

                                it('should show error notification with response message', function () {
                                    var message = "test message";

                                    var promise = httpWrapper.post();

                                    post.resolve({ message: message });

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(notify.error).toHaveBeenCalledWith(message);
                                    });
                                });
                            });

                            describe('and response message does not exist', function () {

                                it('should reject promise with default message', function () {
                                    var promise = httpWrapper.post();

                                    post.resolve({});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response is not successful');
                                    });
                                });

                                it('should show error notification with default message', function () {
                                    var promise = httpWrapper.post();

                                    post.resolve({});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(notify.error).toHaveBeenCalledWith('Response is not successful');
                                    });
                                });
                            });
                        });
                    });

                    describe('and response state is success', function () {

                        it('should resolve promise with response data', function () {
                            var promise = httpWrapper.post();
                            var data = { title: 'title', description: 'description' };

                            post.resolve({ success: true, data: data });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolvedWith(data);
                            });
                        });

                    });

                });

            });

        });

    });

});