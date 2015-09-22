define(['repositories/learningPathRepository'], function (repository) {
    "use strict";

    var dataContext = require('dataContext');

    describe('repository [learningPathRepository]', function () {

        it('should be object', function () {
            expect(repository).toBeObject();
        });

        describe('getById:', function () {

            it('should be function', function () {
                expect(repository.getById).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.getById()).toBePromise();
            });

            describe('when learning path id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning path id (string) was expected');
                        done();
                    });
                });

            });

            describe('when learning path id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning path id (string) was expected');
                        done();
                    });
                });

            });

            describe('when learning path id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning path id (string) was expected');
                        done();
                    });
                });

            });

            describe('when learning path exists on server', function () {

                describe('when learning path not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var learningPath = { id: 'asdasdasd', test1: 'test1' };
                        dataContext.learningPaths = [{ id: 'someId', test2: 'test2' }];

                        var promise = repository.getById(learningPath.id);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Learning path with this id is not found');
                            done();
                        });
                    });

                });

                it('should resolve promise with learning path from data context', function (done) {
                    var learningPath = { id: 'asdasdasd', test1: 'test1' };
                    dataContext.learningPaths = [learningPath, { id: 'someId', test2: 'test2' }];

                    var promise = repository.getById(learningPath.id);

                    promise.fin(function () {
                        expect(promise.inspect().value).toEqual(learningPath);
                        done();
                    });
                });

            });

        });

    });

});
