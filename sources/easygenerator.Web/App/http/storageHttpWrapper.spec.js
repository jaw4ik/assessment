define(['http/storageHttpWrapper'], function (storageHttpWrapper) {
    "use strict";

    var
        http = require('http/storageHttpRequestSender'),
        app = require('durandal/app');

    describe('[storageHttpWrapper]', function () {

        it('should be object', function () {
            expect(storageHttpWrapper).toBeObject();
        });

        describe('post:', function () {

            var post;

            beforeEach(function () {
                post = Q.defer();
                spyOn(http, 'post').and.returnValue(post.promise);
                spyOn(app, 'trigger');
            });

            it('should be function', function () {
                expect(storageHttpWrapper.post).toBeFunction();
            });

            it('should return promise', function () {
                expect(storageHttpWrapper.post()).toBePromise();
            });

            it('should trigger \'stoargeHttpWrapper:post-begin\' event', function () {
                storageHttpWrapper.post();

                expect(app.trigger).toHaveBeenCalledWith('storageHttpWrapper:post-begin');
            });

            it('should make a post request', function () {
                var url = "url";
                var data = { title: 'title' };

                storageHttpWrapper.post(url, data);

                expect(http.post).toHaveBeenCalledWith(url, data, { Authorization: jasmine.any(String) });
            });

            it('should trigger \'storageHttpWrapper:post-end\' event', function (done) {
                var promise = storageHttpWrapper.post();
                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith('storageHttpWrapper:post-end');
                    done();
                });

                post.resolve();
            });

        });

        describe('get:', function () {

            var get;

            beforeEach(function () {
                get = Q.defer();
                spyOn(http, 'get').and.returnValue(get.promise);
                spyOn(app, 'trigger');
            });

            it('should be function', function () {
                expect(storageHttpWrapper.get).toBeFunction();
            });

            it('should return promise', function () {
                expect(storageHttpWrapper.get()).toBePromise();
            });

            it('should trigger \'stoargeHttpWrapper:get-begin\' event', function () {
                storageHttpWrapper.get();

                expect(app.trigger).toHaveBeenCalledWith('storageHttpWrapper:get-begin');
            });

            it('should make a get request', function () {
                var url = "url";
                var data = { title: 'title' };

                storageHttpWrapper.get(url, data);

                expect(http.get).toHaveBeenCalledWith(url, data, { Authorization: jasmine.any(String) });
            });

            it('should trigger \'storageHttpWrapper:get-end\' event', function (done) {
                var promise = storageHttpWrapper.get();
                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith('storageHttpWrapper:get-end');
                    done();
                });

                get.resolve();
            });

        });

    });

});