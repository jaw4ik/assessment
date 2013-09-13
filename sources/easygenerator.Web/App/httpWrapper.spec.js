define(['httpWrapper'], function (httpWrapper) {
    "use strict";

    var
        http = require('plugins/http');

    describe('[httpWrapper]', function () {

        it('should be object', function () {
            expect(httpWrapper).toBeObject();
        });

        describe('post:', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn(http, 'post').andReturn(post.promise());
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

            describe('when post request failed', function () {

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

            });

            describe('when post request succeed', function () {

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

                        describe('and response message exists', function () {

                            it('should reject promise with response message', function () {
                                var message = "An error occured";
                                var promise = httpWrapper.post();

                                post.resolve({ message: message });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith(message);
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