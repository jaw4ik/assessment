define(['repositories/commentRepository'], function (repository) {
    "use strict";

    var apiHttpWrapper = require('http/apiHttpWrapper');

    describe('repository [commentRepository]', function () {

        var post;

        beforeEach(function () {
            post = Q.defer();
            spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be defined', function () {
            expect(repository).toBeDefined();
        });

        describe('getCollection:', function () {

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
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/comments', { courseId: courseId });
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

        describe('removeComment', function () {

            xit('should return promise', function () {
                expect(repository.removeComment()).toBePromise();
            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeComment(null, null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when comment id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeComment('courseId', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Comment id is not a string');
                        done();
                    });
                });

            });

            describe('when courseId and commentId are strings', function () {
                var courseId = 'SomeId',
                    commentId = 'commentId';

                it('should send request to \'api/comment/delete\'', function (done) {
                    var promise = repository.removeComment(courseId, commentId);

                    promise.fin(function () {
                        expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/comment/delete', { courseId: courseId, commentId: commentId });
                        done();
                    });

                    post.reject('error');
                });

                describe('and response is not a boolean', function () {
                    it('should reject promise', function (done) {
                        var promise = repository.removeComment(courseId, commentId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not a boolean');
                            done();
                        });

                        post.resolve("");
                    });

                });

                describe('and response is boolean', function () {
                    it('should return response', function (done) {
                        var promise = repository.removeComment(courseId, commentId);

                        promise.fin(function () {
                            expect(promise.inspect()).toBeTruthy();
                            done();
                        });

                        post.resolve(true);
                    });
                });
            });
        });

        describe('restoreComment', function () {
            
            it('should return promise', function () {
                expect(repository.restoreComment()).toBePromise();
            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.restoreComment(null, null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when comment data is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.restoreComment('courseId', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Comment data is not an object');
                        done();
                    });
                });

            });

            describe('when comment text is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.restoreComment('courseId', {
                        name: 'name',
                        email: 'email',
                        createdOn: '2015-12-10'
                    });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Comment text is not a string');
                        done();
                    });
                });
            });

            describe('when comment name is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.restoreComment('courseId', {
                        text: 'text',
                        email: 'email',
                        createdOn: '2015-12-10'
                    });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Comment name is not a string');
                        done();
                    });
                });
            });

            describe('when comment email is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.restoreComment('courseId', {
                        text: 'text',
                        name: 'name',
                        createdOn: '2015-12-10'
                    });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Comment email is not a string');
                        done();
                    });
                });
            });

            describe('when comment createdOn is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.restoreComment('courseId', {
                        text: 'text',
                        name: 'name',
                        email: 'email'
                    });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Comment createdOn is not a date');
                        done();
                    });
                });
            });

            describe('when comment createdOn is not a date', function () {

                it('should reject promise', function (done) {
                    var promise = repository.restoreComment('courseId', {
                        text: 'text',
                        name: 'name',
                        email: 'email',
                        createdOn: ''
                    });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Comment createdOn is not a date');
                        done();
                    });
                });
            });

            describe('when courseId and comment are defined', function () {
                var courseId = 'SomeId',
                    comment = {
                    text: 'text',
                    name: 'name',
                    email: 'email',
                    createdOn: '2015-12-10'
                };;

                it('should send request to \'api/comment/restore\'', function (done) {
                    var promise = repository.restoreComment(courseId, comment);

                    promise.fin(function () {
                        expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/comment/restore', {
                            courseId: courseId,
                            text: comment.text,
                            createdByName: comment.name,
                            createdBy: comment.email,
                            createdOn: comment.createdOn
                        });
                        done();
                    });

                    post.reject('error');
                });

                describe('and response is not a boolean', function () {
                    it('should reject promise', function (done) {
                        var promise = repository.restoreComment(courseId, comment);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not a boolean');
                            done();
                        });

                        post.resolve("");
                    });

                });

                describe('and response is boolean', function () {
                    it('should return response', function (done) {
                        var promise = repository.restoreComment(courseId, comment);

                        promise.fin(function () {
                            expect(promise.inspect()).toBeTruthy();
                            done();
                        });

                        post.resolve(true);
                    });
                });
            });
        });
    });
});