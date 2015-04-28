define(['repositories/commentRepository'], function (repository) {
    "use strict";

    var httpWrapper = require('http/httpWrapper');

    describe('repository [commentRepository]', function () {

        var post;

        beforeEach(function () {
            post = Q.defer();
            spyOn(httpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be defined', function () {
            expect(repository).toBeDefined();
        });

        describe('getCollection:', function () {

            it('should be function', function () {
                expect(repository.getCollection).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.getCollection()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getCollection(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getCollection(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getCollection({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/comments\'', function (done) {
                var courseId = 'SomeId';
                var promise = repository.getCollection(courseId);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/comments', { courseId: courseId });
                    done();
                });

                post.reject('Boetz eto zalet');
            });

            describe('when comments received from server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.getCollection('123123132123');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('Boetz eto zalet');
                    });

                });

                describe('and response.Comments is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.getCollection('123123132123');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Comments is not an array');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and response.Comments is not an Array', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.getCollection('123123132123');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Comments is not an array');
                            done();
                        });

                        post.resolve({ Comments: 'trololo' });
                    });

                });

                it('should resolve promise with mapped comments array', function (done) {
                    var comments = [
                    {
                        Id: 'qwe',
                        Text: 'fghsdhdfgh',
                        CreatedOn: new Date().toISOString()
                    }];

                    var promise = repository.getCollection('123123132123');

                    promise.fin(function () {
                        expect(promise.inspect().value.length).toEqual(1);
                        expect(promise.inspect().value[0].id).toEqual(comments[0].Id);
                        expect(promise.inspect().value[0].text).toEqual(comments[0].Text);
                        expect(promise.inspect().value[0].createdOn).toEqual(comments[0].CreatedOn);
                        done();
                    });

                    post.resolve({ Comments: comments });
                });

            });

        });

    });
});