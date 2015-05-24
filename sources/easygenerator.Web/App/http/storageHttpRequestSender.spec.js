define(['http/storageHttpRequestSender'], function (storageHttpRequestSender) {
    "use strict";

    describe('[storageHttpRequestSender]', function () {

        it('should be object', function () {
            expect(storageHttpRequestSender).toBeObject();
        });

        describe('post:', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn($, 'ajax').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(storageHttpRequestSender.post).toBeFunction();
            });

            it('should return promise', function () {
                expect(storageHttpRequestSender.post()).toBePromise();
            });

            it('should make a post request', function () {
                var url = "url";
                var data = { title: 'title' };
                var headers = { auth: 'auth' };

                storageHttpRequestSender.post(url, data, headers);

                expect($.ajax).toHaveBeenCalledWith({
                    url: url,
                    data: data,
                    method: 'POST',
                    headers: headers,
                    global: false
                });
            });

            describe('when post request failed', function () {

                it('should reject promise with status', function (done) {
                    var promise = storageHttpRequestSender.post();
                    promise.fin(function () {
                        expect(promise).toBeRejectedWith(reason.status);
                        done();
                    });

                    var reason = { status: 404 };

                    post.reject(reason);
                });
            });

            describe('when post request succeed', function () {

                it('should resolve promise with response', function () {
                    var promise = storageHttpRequestSender.post();
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(response);
                        done();
                    });

                    var response = {};
                    post.resolve(response);
                });

            });

        });

        describe('get:', function () {
            var get;

            beforeEach(function () {
                get = $.Deferred();
                spyOn($, 'ajax').and.returnValue(get.promise());
            });

            it('should be function', function () {
                expect(storageHttpRequestSender.get).toBeFunction();
            });

            it('should return promise', function () {
                expect(storageHttpRequestSender.get()).toBePromise();
            });

            it('should make a get request', function () {
                var url = "url";
                var data = { title: 'title' };
                var headers = { auth: 'auth' };

                storageHttpRequestSender.get(url, data, headers);

                expect($.ajax).toHaveBeenCalledWith(url, { data: data, headers: headers, global: false });
            });

            describe('when get request failed', function () {

                it('should reject promise with status', function (done) {
                    var promise = storageHttpRequestSender.get();
                    promise.fin(function () {
                        expect(promise).toBeRejectedWith(reason.status);
                        done();
                    });

                    var reason = { status: 404 };

                    get.reject(reason);
                });
            });

            describe('when get request succeed', function () {

                it('should resolve promise with response', function () {
                    var promise = storageHttpRequestSender.get();
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(response);
                        done();
                    });

                    var response = {};
                    get.resolve(response);
                });

            });
        });
    });
});