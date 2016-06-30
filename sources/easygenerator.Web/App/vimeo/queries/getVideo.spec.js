import task from './getVideo';

import http from 'plugins/http';

describe('[check video availability task]', function () {

    it('should be object', function () {
        expect(task).toBeObject();
    });

    describe('execute:', function () {

        var dfd;

        beforeEach(function () {
            dfd = $.Deferred();
            spyOn(http, 'get').and.returnValue(dfd.promise());
        });

        it('should be function', function () {
            expect(task.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(task.execute()).toBePromise();
        });

        it('should send request to get video metadata', function () {
            task.execute();
            expect(http.get).toHaveBeenCalled();
        });


        describe('when request is successful', function () {

            var metadata = {};

            beforeEach(function () {
                dfd.resolve(metadata);
            });

            it('should resolve promise', function (done) {
                task.execute('id').then(function (result) {
                    expect(result).toEqual(metadata);
                    done();
                }).done();
            });

        });

        describe('when request failed', function() {

            beforeEach(function() {
                dfd.reject();
            });

            it('should reject promise', function(done) {
                task.execute('id').catch(function(reason) {
                    expect(reason).toBeUndefined();
                    done();
                }).done();
            });

        });

        describe('when vimeoId is not a string', function () {

            it('should reject promise', function (done) {
                task.execute().catch(function (reason) {
                    expect(reason).toBeDefined();
                    done();
                }).done();
            });

        });

    });

});
