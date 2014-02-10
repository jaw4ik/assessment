define(['repositories/commentRepository'], function (commentRepository) {
    "use strict";

    var httpWrapper = require('httpWrapper');

    describe('repository [commentRepository]', function () {

        it('should be defined', function () {
            expect(commentRepository).toBeDefined();
        });

        var post;

        beforeEach(function () {
            post = Q.defer();
            spyOn(httpWrapper, 'post').andReturn(post.promise);
        });

        describe('getCollection:', function () {

            it('should be function', function () {
                expect(commentRepository.getCollection).toBeFunction();
            });

            it('should return promise', function () {
                expect(commentRepository.getCollection()).toBePromise();
            });

            describe('when courseId is not a string', function () {

                it('should reject promise', function () {
                    var promise = commentRepository.getCollection(null);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                    });
                });

            });

            describe('when courseId is string', function () {

                it('should send request to \'api/comments\'', function () {
                    var promise = commentRepository.getCollection('courseId');
                    post.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/comments', { courseId: 'courseId' });
                    });
                });

                describe('and when request was not successful', function () {

                    it('should reject promise', function () {
                        var promise = commentRepository.getCollection('courseId');

                        var reason = 'some reason';
                        post.reject(reason);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(reason);
                        });
                    });

                });

                describe('and when request was successful', function () {

                    describe('and response is not an object', function () {

                        it('should reject promise', function () {
                            var promise = commentRepository.getCollection('courseId');

                            post.resolve(null);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Response is not an object');
                            });
                        });

                    });

                    describe('and response.Comments is not an array', function () {

                        it('should reject promise', function () {
                            var promise = commentRepository.getCollection('courseId');

                            post.resolve({ Comments: 'string' });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Comments is not an array');
                            });
                        });

                    });

                    describe('and response data is correct', function() {
                        
                        it('should resolve promise', function() {
                            var promise = commentRepository.getCollection('courseId');

                            post.resolve({ Comments: [] });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                            });
                        });

                        it('should map comments', function() {
                            var promise = commentRepository.getCollection('courseId');

                            var comments = [{ Id: '0', Text: 'comment1', CreatedOn: '01.02.2014' }];
                            post.resolve({ Comments: comments });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolvedWith([{ id: '0', createdOn: '01.02.2014', text: 'comment1'}]);
                            });
                        });

                    });

                });

            });

        });

    });
});