﻿define(['repositories/courseRepository'], function (repository) {
    "use strict";

    var
        httpWrapper = require('http/httpWrapper'),
        dataContext = require('dataContext'),
        constants = require('constants'),
        app = require('durandal/app'),
        courseMapper = require('mappers/courseModelMapper'),
        userContext = require('userContext');

    describe('repository [courseRepository]', function () {

        var post;
        var identity = {
            email: 'email',
            fullname: 'fullname'
        };

        beforeEach(function () {
            post = Q.defer();
            spyOn(httpWrapper, 'post').and.returnValue(post.promise);
            spyOn(app, 'trigger');
            userContext.identity = identity;
        });

        it('should be object', function () {
            expect(repository).toBeObject();
        });

        describe('getCollection:', function () {

            it('should be function', function () {
                expect(repository.getCollection).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.getCollection()).toBePromise();
            });

            it('should resolve promise with existing courses', function (done) {
                dataContext.courses = [{ test1: 'test1' }, { test2: 'test2' }];

                var promise = repository.getCollection();

                promise.fin(function () {
                    expect(promise.inspect().value).toEqual(dataContext.courses);
                    done();
                });
            });

        });

        describe('getById:', function () {

            it('should be function', function () {
                expect(repository.getById).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.getById()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id (string) was expected');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id (string) was expected');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id (string) was expected');
                        done();
                    });
                });

            });

            describe('when course exists on server', function () {

                describe('when course not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var course = { id: 'asdasdasd', test1: 'test1' };
                        dataContext.courses = [{ id: 'someId', test2: 'test2' }];

                        var promise = repository.getById(course.id);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course with this id is not found');
                            done();
                        });
                    });

                });

                it('should resolve promise with course from data context', function (done) {
                    var course = { id: 'asdasdasd', test1: 'test1' };
                    dataContext.courses = [course, { id: 'someId', test2: 'test2' }];

                    var promise = repository.getById(course.id);

                    promise.fin(function () {
                        expect(promise.inspect().value).toEqual(course);
                        done();
                    });
                });

            });

        });

        describe('addCourse:', function () {

            var title = 'course title';

            it('should be function', function () {
                expect(repository.addCourse).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.addCourse()).toBePromise();
            });

            describe('when course title is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addCourse(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course title (string) was expected');
                        done();
                    });
                });

            });

            describe('when course title is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addCourse(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course title (string) was expected');
                        done();
                    });
                });

            });

            describe('when course title is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addCourse({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course title (string) was expected');
                        done();
                    });
                });

            });

            it('should send request to \'api/course/create\'', function (done) {
                var promise = repository.addCourse(title);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/create', { title: title });
                    done();
                });

                post.reject('He`s dead Jim');
            });

            describe('when course successfully created on server', function () {
                var mappedCourse,
                    course,
                    courseId = 'courseId',
                    createdOnDate = new Date();

                beforeEach(function () {
                    mappedCourse = {
                        id: courseId,
                        title: 'asdfg',
                        template: {
                            id: 'rtyu'
                        },
                        objectives: [],
                        createdOn: createdOnDate.toISOString(),
                        modifiedOn: createdOnDate.toISOString(),
                        createdBy: 'asasd@ukr.net'
                    };

                    course = { Id: courseId, CreatedOn: createdOnDate.toISOString(), CreatedBy: mappedCourse.createdBy };

                    spyOn(courseMapper, 'map').and.returnValue(mappedCourse);
                    dataContext.templates = [mappedCourse.template];
                    dataContext.objectives = [];
                    dataContext.courses = [];
                });

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.addCourse(title);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('He`s dead Jim');
                    });

                });

                it('should add created course to data context', function (done) {
                    var promise = repository.addCourse(title);

                    promise.fin(function () {
                        expect(dataContext.courses.length).toEqual(1);
                        expect(dataContext.courses[0]).toBe(mappedCourse);
                        done();
                    });

                    post.resolve(course);
                });

                it('should trigger course:created event', function (done) {
                    var promise = repository.addCourse(title);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalled();
                        done();
                    });

                    post.resolve(course);
                });

                it('should resolve promise with received data', function (done) {
                    var promise = repository.addCourse(title);

                    promise.fin(function () {
                        expect(promise.inspect().value).toBe(mappedCourse);
                        done();
                    });

                    post.resolve(course);
                });

            });

        });

        describe('removeCourse:', function () {

            it('should be function', function () {
                expect(repository.removeCourse).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.removeCourse()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeCourse(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id (string) was expected');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeCourse(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id (string) was expected');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeCourse({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id (string) was expected');
                        done();
                    });
                });

            });

            it('should send request to \'api/course/delete\'', function (done) {
                var courseId = 'asdadsasd';
                var promise = repository.removeCourse(courseId);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/delete', { courseId: courseId });
                    done();
                });

                post.reject('He`s dead Jim');
            });

            describe('when course deleted from server', function () {

                it('should remove course from data context', function (done) {
                    var courseId = 'asdadsasd';
                    dataContext.courses = [{ id: courseId }];

                    var promise = repository.removeCourse(courseId);

                    promise.fin(function () {
                        expect(dataContext.courses.length).toEqual(0);
                        done();
                    });

                    post.resolve();
                });

                it('should trigger course:deleted event', function (done) {
                    var courseId = 'asdadsasd';
                    dataContext.courses = [{ id: courseId }];

                    var promise = repository.removeCourse(courseId);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.deleted, courseId);
                        done();
                    });

                    post.resolve();
                });

            });

        });

        describe('relateObjective:', function () {

            it('should be function', function () {
                expect(repository.relateObjective).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.relateObjective()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.relateObjective(undefined, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not valid');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.relateObjective(null, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not valid');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.relateObjective({}, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not valid');
                        done();
                    });
                });

            });

            describe('when objective id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.relateObjective('asdasdasd', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id is not valid');
                        done();
                    });
                });

            });

            describe('when objective id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.relateObjective('asdasdasd', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id is not valid');
                        done();
                    });
                });

            });

            describe('when objective id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.relateObjective('asdasdasd', []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id is not valid');
                        done();
                    });
                });

            });

            it('should send request to \'api/course/relateObjective\'', function (done) {
                var
                    courseId = 'adsasdasd',
                    objectiveId = 'obj1';

                var promise = repository.relateObjective(courseId, objectiveId, 5);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/relateObjective', { courseId: courseId, objectiveId: objectiveId, index: 5 });
                    done();
                });

                post.reject('He`s dead Jim');
            });

            describe('when objectives successfully related on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'adsasdasd',
                            objectiveId = 'obj1';

                        var promise = repository.relateObjective(courseId, objectiveId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('He`s dead Jim');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'adsasdasd',
                            objectiveId = 'obj1';

                        var promise = repository.relateObjective(courseId, objectiveId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and course not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'adsasdasd',
                            objectiveId = 'obj1';

                        dataContext.courses = [];

                        var promise = repository.relateObjective(courseId, objectiveId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course doesn`t exist');
                            done();
                        });

                        post.resolve({ ModifiedOn: 'asdadas' });
                    });

                });

                it('should add successfully related objectives to course in dataContext', function (done) {
                    var
                        courseId = 'adsasdasd',
                        objectiveId = 'obj1';

                    dataContext.courses = [{ id: courseId, objectives: [] }];
                    dataContext.objectives = [{ id: objectiveId }];

                    var promise = repository.relateObjective(courseId, objectiveId);

                    promise.fin(function () {
                        expect(dataContext.courses[0].objectives.length).toEqual(1);
                        expect(dataContext.courses[0].objectives[0].id).toEqual(objectiveId);
                        done();
                    });

                    post.resolve({ ModifiedOn: new Date().toISOString() });
                });

                it('should trigger course:objectiveRelated event', function (done) {
                    var
                        courseId = 'adsasdasd',
                        objectiveId = 'obj1';

                    dataContext.courses = [{ id: courseId, objectives: [] }];
                    dataContext.objectives = [{ id: objectiveId }];

                    var promise = repository.relateObjective(courseId, objectiveId);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalled();
                        expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.course.objectiveRelated);
                        expect(app.trigger.calls.mostRecent().args[1]).toEqual(courseId);
                        expect(app.trigger.calls.mostRecent().args[2]).toBeObject();
                        expect(app.trigger.calls.mostRecent().args[2].id).toEqual(objectiveId);
                        done();
                    });

                    post.resolve({ ModifiedOn: new Date().toISOString() });
                });

                it('should resolve promise with received data', function (done) {
                    var
                        courseId = 'adsasdasd',
                        objectiveId = 'obj1',
                        modifiedOnDate = new Date();

                    dataContext.courses = [{ id: courseId, objectives: [] }];
                    dataContext.objectives = [{ id: objectiveId }];

                    var promise = repository.relateObjective(courseId, objectiveId);

                    promise.fin(function () {
                        expect(promise.inspect().value.modifiedOn).toEqual(modifiedOnDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

            });

        });

        describe('unrelateObjectives:', function () {

            it('should be function', function () {
                expect(repository.unrelateObjectives).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.unrelateObjectives()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.unrelateObjectives(undefined, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not valid');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.unrelateObjectives(null, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not valid');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.unrelateObjectives({}, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not valid');
                        done();
                    });
                });

            });

            describe('when objectives array is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.unrelateObjectives('asdasdasd', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objectives to relate are not array');
                        done();
                    });
                });

            });

            describe('when objectives array is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.unrelateObjectives('asdasdasd', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objectives to relate are not array');
                        done();
                    });
                });

            });

            describe('when objectives array is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.unrelateObjectives('asdasdasd', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objectives to relate are not array');
                        done();
                    });
                });

            });

            it('should send request to \'api/course/unrelateObjectives\'', function (done) {
                var
                    courseId = 'adsasdasd',
                    objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                    mappedObjectives = ['obj1', 'obj2'];

                var promise = repository.unrelateObjectives(courseId, objectives);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/unrelateObjectives', { courseId: courseId, objectives: mappedObjectives });
                    done();
                });

                post.reject('He`s dead Jim');
            });

            describe('when objectives successfully unrelated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'adsasdasd',
                            objectives = [{ id: 'obj1' }, { id: 'obj2' }];

                        var promise = repository.unrelateObjectives(courseId, objectives);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('He`s dead Jim');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'adsasdasd',
                            objectives = [{ id: 'obj1' }, { id: 'obj2' }];

                        var promise = repository.unrelateObjectives(courseId, objectives);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and course not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'adsasdasd',
                            objectives = [{ id: 'obj1' }, { id: 'obj2' }];

                        dataContext.courses = [];

                        var promise = repository.unrelateObjectives(courseId, objectives);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course doesn`t exist');
                            done();
                        });

                        post.resolve({ ModifiedOn: 'asdadas' });
                    });

                });

                it('should remove urelated objectives from course in dataContext', function (done) {
                    var
                        courseId = 'adsasdasd',
                        objectives = [{ id: 'obj1' }, { id: 'obj2' }];

                    dataContext.courses = [{ id: courseId, objectives: objectives }];

                    var promise = repository.unrelateObjectives(courseId, [objectives[0]]);

                    promise.fin(function () {
                        expect(dataContext.courses[0].objectives.length).toEqual(1);
                        expect(dataContext.courses[0].objectives[0].id).toEqual(objectives[1].id);
                        done();
                    });

                    post.resolve({ ModifiedOn: new Date().toISOString() });
                });

                it('should trigger course:objectivesUnrelated event', function (done) {
                    var
                        courseId = 'adsasdasd',
                        objectives = [{ id: 'obj1' }, { id: 'obj2' }];

                    dataContext.courses = [{ id: courseId, objectives: objectives }];

                    var promise = repository.unrelateObjectives(courseId, [objectives[0]]);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalled();
                        expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.course.objectivesUnrelated);
                        expect(app.trigger.calls.mostRecent().args[1]).toEqual(courseId);
                        expect(app.trigger.calls.mostRecent().args[2].length).toEqual(1);
                        expect(app.trigger.calls.mostRecent().args[2][0]).toEqual(objectives[0].id);
                        done();
                    });

                    post.resolve({ ModifiedOn: new Date().toISOString() });
                });

                it('should resolve promise with received data', function (done) {
                    var
                        courseId = 'adsasdasd',
                        objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                        modifiedOnDate = new Date();

                    dataContext.courses = [{ id: courseId, objectives: objectives }];

                    var promise = repository.unrelateObjectives(courseId, [objectives[0]]);

                    promise.fin(function () {
                        expect(promise.inspect().value).toEqual(modifiedOnDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

            });

        });

        describe('updateCourseTitle:', function () {

            it('should be function', function () {
                expect(repository.updateCourseTitle).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateCourseTitle()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTitle(undefined, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTitle(null, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTitle({}, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course title is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTitle('asdasdasd', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course title is not a string');
                        done();
                    });
                });

            });

            describe('when course title is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTitle('asdasdasd', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course title is not a string');
                        done();
                    });
                });

            });

            describe('when course title is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTitle('asdasdasd', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course title is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/course/updateTitle\'', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    courseTitle = 'dfgjghjdghj';

                var promise = repository.updateCourseTitle(courseId, courseTitle);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/updateTitle', { courseId: courseId, courseTitle: courseTitle });
                    done();
                });

                post.reject('He`s dead Jim');
            });

            describe('when course title was successfully updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            courseTitle = 'dfgjghjdghj';

                        var promise = repository.updateCourseTitle(courseId, courseTitle);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('He`s dead Jim');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            courseTitle = 'dfgjghjdghj';

                        var promise = repository.updateCourseTitle(courseId, courseTitle);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and course not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            courseTitle = 'dfgjghjdghj';

                        dataContext.courses = [];

                        var promise = repository.updateCourseTitle(courseId, courseTitle);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course does not exist in dataContext');
                            done();
                        });

                        post.resolve({ ModifiedOn: 'asdadas' });
                    });

                });

                it('should update course in dataContext', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        courseTitle = 'dfgjghjdghj',
                        modifiedDate = new Date();

                    dataContext.courses = [{ id: courseId, title: '', modifiedOn: new Date('') }];

                    var promise = repository.updateCourseTitle(courseId, courseTitle);

                    promise.fin(function () {
                        expect(dataContext.courses[0].title).toEqual(courseTitle);
                        expect(dataContext.courses[0].modifiedOn).toEqual(modifiedDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedDate.toISOString() });
                });

                it('should trigger course:titleUpdated event', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        courseTitle = 'dfgjghjdghj',
                        modifiedDate = new Date();

                    dataContext.courses = [{ id: courseId, title: '', modifiedOn: new Date('') }];

                    var promise = repository.updateCourseTitle(courseId, courseTitle);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalled();
                        expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.course.titleUpdated);
                        expect(app.trigger.calls.mostRecent().args[1].id).toEqual(courseId);
                        expect(app.trigger.calls.mostRecent().args[1].title).toEqual(courseTitle);
                        expect(app.trigger.calls.mostRecent().args[1].modifiedOn).toEqual(modifiedDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedDate.toISOString() });
                });

                it('should resolve promise with received modification date', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        courseTitle = 'dfgjghjdghj',
                        modifiedDate = new Date();

                    dataContext.courses = [{ id: courseId, title: '', modifiedOn: new Date('') }];

                    var promise = repository.updateCourseTitle(courseId, courseTitle);

                    promise.fin(function () {
                        expect(promise.inspect().value).toEqual(modifiedDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedDate.toISOString() });
                });

            });

        });

        describe('updateCourseTemplate:', function () {

            it('should be function', function () {
                expect(repository.updateCourseTemplate).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateCourseTemplate()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTemplate(undefined, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTemplate(null, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTemplate({}, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when template id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTemplate('asdasdasd', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Template id is not a string');
                        done();
                    });
                });

            });

            describe('when template id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTemplate('asdasdasd', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Template id is not a string');
                        done();
                    });
                });

            });

            describe('when template id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateCourseTemplate('asdasdasd', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Template id is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/course/updateTemplate\'', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    templateId = 'dfgjghjdghj';

                var promise = repository.updateCourseTemplate(courseId, templateId);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/updateTemplate', { courseId: courseId, templateId: templateId });
                    done();
                });

                post.reject('He`s dead Jim');
            });

            describe('when course title was successfully updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            templateId = 'dfgjghjdghj';

                        var promise = repository.updateCourseTemplate(courseId, templateId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('He`s dead Jim');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            templateId = 'dfgjghjdghj';

                        var promise = repository.updateCourseTemplate(courseId, templateId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and course not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            templateId = 'dfgjghjdghj';

                        dataContext.courses = [];

                        var promise = repository.updateCourseTemplate(courseId, templateId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course does not exist in dataContext');
                            done();
                        });

                        post.resolve({ ModifiedOn: 'asdadas' });
                    });

                });

                it('should update course in dataContext', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        templateId = 'dfgjghjdghj',
                        modifiedDate = new Date();

                    dataContext.courses = [{ id: courseId, title: '', modifiedOn: new Date('') }];
                    dataContext.templates = [{ id: templateId, name: 'template.name', thumbnail: 'template.image' }];

                    var promise = repository.updateCourseTemplate(courseId, templateId);

                    promise.fin(function () {
                        expect(dataContext.courses[0].template).toEqual(dataContext.templates[0]);
                        expect(dataContext.courses[0].modifiedOn).toEqual(modifiedDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedDate.toISOString() });
                });

                it('should resolve promise with received modification date', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        templateId = 'dfgjghjdghj',
                        modifiedDate = new Date();

                    dataContext.courses = [{ id: courseId, title: '', modifiedOn: new Date('') }];
                    dataContext.templates = [{ id: templateId, name: 'template.name', thumbnail: 'template.image' }];

                    var promise = repository.updateCourseTemplate(courseId, templateId);

                    promise.fin(function () {
                        expect(promise.inspect().value.modifiedOn).toEqual(modifiedDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedDate.toISOString() });
                });

            });

        });

        describe('updateIntroductionContent:', function () {

            it('should be function', function () {
                expect(repository.updateIntroductionContent).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateIntroductionContent()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateIntroductionContent(undefined, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateIntroductionContent(null, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateIntroductionContent({}, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/course/updateintroductioncontent\'', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    introductionContent = 'dfgjghjdghj';

                var promise = repository.updateIntroductionContent(courseId, introductionContent);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/updateintroductioncontent', { courseId: courseId, introductionContent: introductionContent });
                    done();
                });

                post.reject('He`s dead Jim');
            });

            describe('when introduction content was updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            introductionContent = 'dfgjghjdghj';

                        var promise = repository.updateIntroductionContent(courseId, introductionContent);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('He`s dead Jim');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            introductionContent = 'dfgjghjdghj';

                        var promise = repository.updateIntroductionContent(courseId, introductionContent);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and course not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            introductionContent = 'dfgjghjdghj';

                        dataContext.courses = [];

                        var promise = repository.updateIntroductionContent(courseId, introductionContent);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course does not exist in dataContext');
                            done();
                        });

                        post.resolve({ ModifiedOn: 'asdadas' });
                    });

                });

                it('should update course in dataContext', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        introductionContent = 'dfgjghjdghj',
                        modifiedOnDate = new Date();

                    dataContext.courses = [{ id: courseId, introductionContent: '' }];

                    var promise = repository.updateIntroductionContent(courseId, introductionContent);

                    promise.fin(function () {
                        expect(dataContext.courses[0].introductionContent).toEqual(introductionContent);
                        expect(dataContext.courses[0].modifiedOn).toEqual(modifiedOnDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

                it('should resolve promise with modification date', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        introductionContent = 'dfgjghjdghj',
                        modifiedOnDate = new Date();

                    dataContext.courses = [{ id: courseId, introductionContent: '' }];

                    var promise = repository.updateIntroductionContent(courseId, introductionContent);

                    promise.fin(function () {
                        expect(promise.inspect().value).toEqual(modifiedOnDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

            });

        });

        describe('updateObjectiveOrder:', function () {

            it('should be function', function () {
                expect(repository.updateObjectiveOrder).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateObjectiveOrder()).toBePromise();
            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateObjectiveOrder(undefined, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateObjectiveOrder(null, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateObjectiveOrder({}, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('when course id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateObjectiveOrder('asdasd', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objectives to relate are not array');
                        done();
                    });
                });

            });

            describe('when course id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateObjectiveOrder('asdasdasd', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objectives to relate are not array');
                        done();
                    });
                });

            });

            describe('when course id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateObjectiveOrder('asdasdasd', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objectives to relate are not array');
                        done();
                    });
                });

            });

            it('should send request to \'api/course/updateobjectivesorder\'', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                    mappedObjectives = ['obj1', 'obj2'];

                var promise = repository.updateObjectiveOrder(courseId, objectives);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/course/updateobjectivesorder', { courseId: courseId, objectives: mappedObjectives });
                    done();
                });

                post.reject('He`s dead Jim');
            });

            describe('when objectives order successfully saved to server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                            mappedObjectives = ['obj1', 'obj2'];

                        var promise = repository.updateObjectiveOrder(courseId, objectives);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not an object');
                            done();
                        });

                        post.resolve('He`s dead Jim');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                            mappedObjectives = ['obj1', 'obj2'];

                        var promise = repository.updateObjectiveOrder(courseId, objectives);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and course not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var
                            courseId = 'qweqeqweqw',
                            objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                            mappedObjectives = ['obj1', 'obj2'];

                        dataContext.courses = [];

                        var promise = repository.updateObjectiveOrder(courseId, objectives);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course doesn`t exist');
                            done();
                        });

                        post.resolve({ ModifiedOn: 'asdadas' });
                    });

                });

                it('should update course in data context', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                        mappedObjectives = ['obj1', 'obj2'],
                        modifiedOnDate = new Date();

                    dataContext.courses = [{ id: courseId, objectives: [objectives[1], objectives[0]] }];

                    var promise = repository.updateObjectiveOrder(courseId, objectives);

                    promise.fin(function () {
                        expect(dataContext.courses[0].objectives[0].id).toEqual(objectives[0].id);
                        expect(dataContext.courses[0].objectives[1].id).toEqual(objectives[1].id);
                        expect(dataContext.courses[0].modifiedOn).toEqual(modifiedOnDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

                it('should trigger course:objectivesReordered event', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                        mappedObjectives = ['obj1', 'obj2'],
                        modifiedOnDate = new Date();

                    dataContext.courses = [{ id: courseId, objectives: [objectives[1], objectives[0]] }];

                    var promise = repository.updateObjectiveOrder(courseId, objectives);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalled();
                        expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.course.objectivesReordered);
                        expect(app.trigger.calls.mostRecent().args[1].id).toEqual(courseId);
                        expect(app.trigger.calls.mostRecent().args[1].modifiedOn).toEqual(modifiedOnDate);
                        expect(app.trigger.calls.mostRecent().args[1].objectives[0].id).toEqual(objectives[0].id);
                        expect(app.trigger.calls.mostRecent().args[1].objectives[1].id).toEqual(objectives[1].id);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

                it('should resolve promise with modification date', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        objectives = [{ id: 'obj1' }, { id: 'obj2' }],
                        mappedObjectives = ['obj1', 'obj2'],
                        modifiedOnDate = new Date();

                    dataContext.courses = [{ id: courseId, objectives: [objectives[1], objectives[0]] }];

                    var promise = repository.updateObjectiveOrder(courseId, objectives);

                    promise.fin(function () {
                        expect(promise.inspect().value).toEqual(modifiedOnDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

            });

        });

    });

});
