﻿define(['repositories/collaboratorRepository'], function (repository) {
    "use strict";

    var httpWrapper = require('http/httpRequestSender'),
        dataContext = require('dataContext'),
        collaboratorModelMapper = require('mappers/collaboratorModelMapper');

    describe('repository [collaboratorRepository]', function () {

        var post,
         courseId = 'courseId',
         course = { id: courseId },
         email = 'email@email.com',
         collaborator = { Id: '1' },
         mappedCollaborator = { id: '1' };

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

            describe('when course id is null', function () {
                it('should reject promise', function (done) {
                    var promise = repository.getCollection(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('CourseId is not a string');
                        done();
                    });
                });

            });

            describe('when course id is undefined', function () {
                it('should reject promise', function (done) {
                    var promise = repository.getCollection(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('CourseId is not a string');
                        done();
                    });
                });
            });

            describe('when course id is not a string', function () {
                it('should reject promise', function (done) {
                    var promise = repository.getCollection({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('CourseId is not a string');
                        done();
                    });
                });
            });

            describe('when course is not found', function () {
                it('should reject promise', function (done) {
                    dataContext.courses = [];
                    var promise = repository.getCollection(courseId);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course does not exist');
                        done();
                    });
                });
            });

            describe('when course collaborators is defined', function () {
                it('should return collaborators', function (done) {
                    dataContext.courses = [course];
                    course.collaborators = [mappedCollaborator];
                    post.reject('Some reason');
                    var promise = repository.getCollection(courseId);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith([mappedCollaborator]);
                        done();
                    });
                });
            });

            describe('when course collaborators not defined', function() {

                beforeEach(function () {
                    dataContext.courses = [course];
                    course.collaborators = null;
                });

                it('should send request to \'api/course/collaborators\'', function (done) {
                    var promise = repository.getCollection(courseId);

                    promise.fin(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/course/collaborators', { courseId: courseId });
                        done();
                    });

                    post.reject('Some reason');
                });

                describe('and response is not an object', function () {
                    it('should reject promise', function (done) {
                        var promise = repository.getCollection(courseId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('trololo');
                    });
                });

                describe('and response data is not an array', function () {
                    it('should reject promise', function (done) {
                        var promise = repository.getCollection(courseId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response data is not an array');
                            done();
                        });

                        post.resolve({ data: 'trololo' });
                    });
                });

                it('should initialize course collaborators', function (done) {
                    var promise = repository.getCollection(courseId);

                    post.resolve({ data: [collaborator] });
                    spyOn(collaboratorModelMapper, 'map').and.returnValue(mappedCollaborator);

                    promise.fin(function () {
                        expect(course.collaborators).toBeArray();
                        expect(course.collaborators.length).toBe(1);
                        done();
                    });
                });

                it('should return mapped courses array', function (done) {
                    var promise = repository.getCollection(courseId);

                    post.resolve({ data: [collaborator] });
                    spyOn(collaboratorModelMapper, 'map').and.returnValue(mappedCollaborator);

                    promise.fin(function () {
                        expect(promise.inspect().value.length).toEqual(1);
                        expect(promise.inspect().value[0].id).toEqual(mappedCollaborator.id);
                        done();
                    });
                });
            });
        });

        describe('add:', function () {

            it('should be function', function () {
                expect(repository.add).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.add()).toBePromise();
            });

            describe('when course id is undefined', function () {
                it('should reject promise', function (done) {
                    var promise = repository.add(undefined, email);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });
            });

            describe('when course id is null', function () {
                it('should reject promise', function (done) {
                    var promise = repository.add(null, email);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });
            });

            describe('when course id is not a string', function () {
                it('should reject promise', function (done) {
                    var promise = repository.add({}, email);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });
            });

            describe('when email is undefined', function () {
                it('should reject promise', function (done) {
                    var promise = repository.add(courseId, undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Email is not a string');
                        done();
                    });
                });
            });

            describe('when course id is null', function () {
                it('should reject promise', function (done) {
                    var promise = repository.add(courseId, null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Email is not a string');
                        done();
                    });
                });
            });

            describe('when course id is not a string', function () {
                it('should reject promise', function (done) {
                    var promise = repository.add(courseId, {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Email is not a string');
                        done();
                    });
                });
            });

            it('should send request to \'api/course/collaborator/add\'', function (done) {
                var promise = repository.add(courseId, email);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/collaborator/add', { courseId: courseId, email: email });
                    done();
                });

                post.reject('reason');
            });

            describe('when collaborator added on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.add(courseId, email);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('123');
                    });

                });

                describe('and response is not success', function () {
                    var errorMessage = 'error';
                    it('should reject promise with error message', function (done) {
                        var promise = repository.add(courseId, email);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith(errorMessage);
                            done();
                        });

                        post.resolve({ success: false, errorMessage: errorMessage });
                    });

                });

                describe('and response is success', function () {

                    describe('and response data is not an object', function () {

                        it('should resolve promise with null', function (done) {
                            var promise = repository.add(courseId, email);

                            promise.fin(function () {
                                expect(promise).toBeResolvedWith(null);
                                done();
                            });

                            post.resolve({
                                success: true, data: true
                            });
                        });

                    });

                    describe('and response has no Email', function () {

                        it('should reject promise', function (done) {
                            var promise = repository.add(courseId, email);

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Email is not a string');
                                done();
                            });

                            post.resolve({
                                success: true, data: { FullName: 'name' }
                            });
                        });

                    });

                    describe('and course not found in dataContext', function () {

                        it('should reject promise', function (done) {
                            dataContext.courses = [];

                            var receivedData = {
                                Email: 'email',
                                FullName: 'name'
                            };

                            var promise = repository.add(courseId, email);

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Course does not exist in dataContext');
                                done();
                            });

                            post.resolve({
                                success: true, data: receivedData
                            });
                        });

                    });

                    describe('and course collaborators are loaded', function() {
                        it('should update course collaborators in dataContext', function (done) {
                            var questionId = 'someId';

                            dataContext.courses = [
                                {
                                    id: courseId,
                                    collaborators: []
                                }
                            ];

                            var receivedData = {
                                Email: 'email',
                                FullName: 'name'
                            };

                            var promise = repository.add(courseId, email);

                            promise.fin(function () {
                                expect(dataContext.courses[0].collaborators.length).toBe(1);
                                done();
                            });

                            post.resolve({
                                success: true, data: receivedData
                            });
                        });
                    });

                    it('should resolve promise with received information', function (done) {
                        dataContext.courses = [
                            {
                                id: courseId
                            }
                        ];

                        var date = new Date();
                        var receivedData = {
                            Email: 'email',
                            FullName: 'name',
                            CreatedOn: date.toISOString()
                        };

                        var promise = repository.add(courseId, email);

                        promise.fin(function () {
                            expect(promise.inspect().value.email).toEqual(receivedData.Email);
                            expect(promise.inspect().value.fullName).toEqual(receivedData.FullName);
                            expect(promise.inspect().value.createdOn).toEqual(date);

                            done();
                        });

                        post.resolve({
                            success: true, data: receivedData
                        });
                    });

                });

            });
        });

    });
});