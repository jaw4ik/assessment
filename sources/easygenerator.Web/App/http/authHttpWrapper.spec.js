import authHttpWrapper from './authHttpWrapper';

import http from 'http/httpRequestSender';
import app from 'durandal/app';

describe('[authHttpWrapper]', function () {

    it('should be object', function () {
        expect(authHttpWrapper).toBeObject();
    });

    describe('post:', function () {

        var post;

        beforeEach(function () {
            post = Q.defer();
            spyOn(http, 'post').and.returnValue(post.promise);
            spyOn(app, 'trigger');
        });

        it('should be function', function () {
            expect(authHttpWrapper.post).toBeFunction();
        });

        it('should return promise', function () {
            expect(authHttpWrapper.post()).toBePromise();
        });

        it('should trigger \'authHttpWrapper:post-begin\' event', function () {
            authHttpWrapper.post();

            expect(app.trigger).toHaveBeenCalledWith('authHttpWrapper:post-begin');
        });

        it('should make a post request', function () {
            var url = "url";
            var data = { title: 'title' };
            var headers = { Authorization: jasmine.any(String) };

            authHttpWrapper.post(url, data);

            expect(http.post).toHaveBeenCalledWith(url, data, { Authorization: jasmine.any(String), 'cache-control': 'no-cache' });
        });

        describe('when post request succeed', function () {

            it('should trigger \'authHttpWrapper:post-end\' event', function (done) {
                var promise = authHttpWrapper.post();
                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith('authHttpWrapper:post-end');
                    done();
                });

                post.resolve();
            });

            describe('and response data is not an object', function () {

                it('should reject promise', function (done) {
                    var promise = authHttpWrapper.post();
                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response data is not an object');
                        done();
                    });

                    post.resolve();
                });

            });

            describe('and response is an object', function () {
                it('should resolve promise with response data', function (done) {
                    var promise = authHttpWrapper.post();
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(data);
                        done();
                    });

                    var data = { title: 'title', description: 'description' };

                    post.resolve({ success: true, data: data });
                });

            });

        });

        describe('when post request failed', function () {

            it('should trigger \'authHttpWrapper:post-end\' event', function (done) {
                var promise = authHttpWrapper.post();
                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith('authHttpWrapper:post-end');
                    done();
                });

                post.reject();
            });

        });
    });
});
