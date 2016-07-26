import storageHttpWrapper from './storageHttpWrapper';

import http from 'http/storageHttpRequestSender';
import app from 'durandal/app';

describe('[storageHttpWrapper]', function () {

    it('should be object', function () {
        expect(storageHttpWrapper).toBeObject();
    });

    describe('post:', function () {

        var post;
        var getHeader;

        beforeEach(function () {
            post = Q.defer();
            getHeader = Q.defer();
            spyOn(window.auth, 'getHeader').and.returnValue(getHeader.promise);
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

        it('should get api header', function() {
            storageHttpWrapper.post();
            expect(window.auth.getHeader).toHaveBeenCalledWith('storage');
        });

        describe('when header exists', function() {

            beforeEach(function() {
                getHeader.resolve({ Authorization: 'storage' });
            });

            it('should make a post request', function (done) {
                var url = "url";
                var data = { title: 'title' };

                storageHttpWrapper.post(url, data).fin(function() {
                    expect(http.post).toHaveBeenCalledWith(url, data, { Authorization: jasmine.any(String) });
                    done();
                });

                post.resolve();
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

    });

    describe('get:', function () {

        var get;
        var getHeader;

        beforeEach(function () {
            get = Q.defer();
            getHeader = Q.defer();
            spyOn(window.auth, 'getHeader').and.returnValue(getHeader.promise);
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

        it('should get api header', function() {
            storageHttpWrapper.get();
            expect(window.auth.getHeader).toHaveBeenCalledWith('storage');
        });

        describe('when header exists', function() {

            beforeEach(function() {
                getHeader.resolve({ Authorization: 'storage' });
            });

            it('should make a get request', function (done) {
                var url = "url";
                var data = { title: 'title' };

                storageHttpWrapper.get(url, data).fin(function() {
                    expect(http.get).toHaveBeenCalledWith(url, data, { Authorization: jasmine.any(String) });
                    done();
                });

                get.resolve();
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
