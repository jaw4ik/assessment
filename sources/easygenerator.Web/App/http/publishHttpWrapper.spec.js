define(['http/publishHttpWrapper'], function (publishHttpWrapper) {
    "use strict";

    var http = require('http/httpRequestSender');

    describe('[publishHttpWrapper]', function () {

        it('should be object', function () {
            expect(publishHttpWrapper).toBeObject();
        });

        describe('post:', function () {

            var post;

            beforeEach(function () {
                post = Q.defer();
                spyOn(http, 'post').and.returnValue(post.promise);
            });

            it('should be function', function () {
                expect(publishHttpWrapper.post).toBeFunction();
            });

            it('should return promise', function () {
                expect(publishHttpWrapper.post()).toBePromise();
            });

            it('should make a post request', function () {
                var url = "url";
                var data = { title: 'title' };

                publishHttpWrapper.post(url, data);

                expect(http.post).toHaveBeenCalledWith(url, data, { Authorization: jasmine.any(String), 'cache-control': 'no-cache' });
            });

            describe('when post request succeed', function () {

                describe('and response data is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = publishHttpWrapper.post();
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response data is not an object');
                            done();
                        });

                        post.resolve();
                    });

                });

                describe('and response state is not success', function () {
                    var message = "test message";

                    it('should reject promise with response message', function (done) {
                        var promise = publishHttpWrapper.post();
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith(message);
                            done();
                        });

                        post.resolve({ success: false, errorMessage: message });
                    });

                });

                describe('and response state is success', function () {

                    it('should resolve promise with response data', function (done) {
                        var promise = publishHttpWrapper.post();
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