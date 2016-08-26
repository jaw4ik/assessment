import repository from './courseRepository';

import apiHttpWrapper from 'http/apiHttpWrapper';
import dataContext from 'dataContext';
import constants from 'constants';
import app from 'durandal/app';
import courseMapper from 'mappers/courseModelMapper';
import sectionMapper from 'mappers/sectionModelMapper';

describe('repository [courseRepository]', function () {

    var post;

    beforeEach(function () {
        post = Q.defer();
        spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise);
        spyOn(app, 'trigger');
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

        var title = 'course title',
            templateId = 'templateId';

        it('should be function', function () {
            expect(repository.addCourse).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.addCourse()).toBePromise();
        });

        describe('when course title is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.addCourse(undefined, templateId);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course title (string) was expected');
                    done();
                });
            });

        });

        describe('when course title is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.addCourse(null, templateId);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course title (string) was expected');
                    done();
                });
            });

        });

        describe('when course title is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.addCourse({}, templateId);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course title (string) was expected');
                    done();
                });
            });

        });

        describe('when course templateId is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.addCourse(title, undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('TemplateId (string) was expected');
                    done();
                });
            });

        });

        describe('when course templateId is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.addCourse(title, null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('TemplateId (string) was expected');
                    done();
                });
            });

        });

        describe('when course templateId is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.addCourse(title, {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('TemplateId (string) was expected');
                    done();
                });
            });

        });


        it('should send request to \'api/course/create\'', function (done) {
            var promise = repository.addCourse(title, templateId);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/create', { title: title, templateId: templateId });
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
                    sections: [],
                    createdOn: createdOnDate.toISOString(),
                    modifiedOn: createdOnDate.toISOString(),
                    createdBy: 'asasd@ukr.net'
                };

                course = { Id: courseId, CreatedOn: createdOnDate.toISOString(), CreatedBy: mappedCourse.createdBy };

                spyOn(courseMapper, 'map').and.returnValue(mappedCourse);
                dataContext.templates = [mappedCourse.template];
                dataContext.sections = [];
                dataContext.courses = [];
            });

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addCourse(title, templateId);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('He`s dead Jim');
                });

            });

            it('should add created course to data context', function (done) {
                var promise = repository.addCourse(title, templateId);

                promise.fin(function () {
                    expect(dataContext.courses.length).toEqual(1);
                    expect(dataContext.courses[0]).toBe(mappedCourse);
                    done();
                });

                post.resolve(course);
            });

            it('should trigger course:created event', function (done) {
                var promise = repository.addCourse(title, templateId);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalled();
                    done();
                });

                post.resolve(course);
            });

            it('should resolve promise with received data', function (done) {
                var promise = repository.addCourse(title, templateId);

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
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/delete', { courseId: courseId });
                done();
            });

            post.reject('He`s dead Jim');
        });

        describe('when course deleted from server', function () {
            var courseId = 'asdadsasd',
                sectionId = 'sectionId',
                learningPathId = 'learningPathId';

            beforeEach(function() {
                dataContext.courses = [{ id: courseId }];
                dataContext.sections = [{ id: sectionId }];
                dataContext.learningPaths = [{ id: learningPathId, entities: [{ id: courseId }] }];
            });
                

            it('should remove course from data context', function (done) {
                var promise = repository.removeCourse(courseId);

                promise.fin(function () {
                    expect(dataContext.courses.length).toEqual(0);
                    done();
                });

                post.resolve({ deletedSectionIds: [], deletedFromLearningPathIds: [] });
            });

            it('should trigger course:deleted event', function (done) {
                var courseId = 'asdadsasd';
                dataContext.courses = [{ id: courseId }];

                var promise = repository.removeCourse(courseId);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.deleted, courseId);
                    done();
                });

                post.resolve({ deletedSectionIds: [], deletedFromLearningPathIds: [] });
            });

            describe('when response is null', function() {
                it('should not remove course from learning paths', function (done) {
                    var promise = repository.removeCourse(courseId);

                    promise.fin(function () {
                        expect(dataContext.learningPaths[0].entities.length).toEqual(1);
                        done();
                    });

                    post.resolve(null);
                });

                it('should not remove course sections', function (done) {
                    var promise = repository.removeCourse(courseId);

                    promise.fin(function () {
                        expect(dataContext.sections.length).toEqual(1);
                        done();
                    });

                    post.resolve(null);
                });
            });

            describe('when response is not null', function () {
                it('should remove course from learning paths', function (done) {
                    var promise = repository.removeCourse(courseId);

                    promise.fin(function () {
                        expect(dataContext.learningPaths[0].entities.length).toEqual(0);
                        done();
                    });

                    post.resolve({ deletedSectionIds: [], deletedFromLearningPathIds: [learningPathId] });
                });

                it('should remove course sections', function (done) {
                    var promise = repository.removeCourse(courseId);

                    promise.fin(function () {
                        expect(dataContext.sections.length).toEqual(0);
                        done();
                    });

                    post.resolve({ deletedSectionIds: [sectionId], deletedFromLearningPathIds: [] });
                });
            });
        });
    });

    describe('duplicateCourse:', function () {

        var course = { id: 'courseId' };

        it('should be function', function () {
            expect(repository.duplicateCourse).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.duplicateCourse()).toBePromise();
        });

        describe('when course doesn`t exist', function () {

            it('should reject promise', function (done) {
                var promise = repository.duplicateCourse(undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course doesn`t exist');
                    done();
                });
            });

        });

        it('should send request to \'api/course/duplicate\'', function (done) {
            dataContext.courses.push(course);
            var promise = repository.duplicateCourse(course.id);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/duplicate', { courseId: course.id });
                dataContext.courses.splice(dataContext.courses.indexOf(course), 1);
                done();
            });

            post.reject('He`s dead Jim');
        });

        describe('when course successfully created on server', function () {

            beforeEach(function () {
                dataContext.courses = [course];
            });

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var promise = repository.duplicateCourse(course.id);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('He`s dead Jim');
                });

            });

            describe('and response is an object', function () {

                describe('and course is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.duplicateCourse(course.id);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course is not an object');
                            done();
                        });

                        post.resolve({ course: 'course' });
                    });

                });

                describe('and course is an object', function () {

                    var mappedCourse,
                        createdOnDate = new Date();

                    beforeEach(function () {
                        mappedCourse = {
                            id: course.id,
                            title: 'asdfg',
                            template: {
                                id: 'rtyu'
                            },
                            sections: [],
                            createdOn: createdOnDate.toISOString(),
                            modifiedOn: createdOnDate.toISOString(),
                            createdBy: 'asasd@ukr.net'
                        };

                        dataContext.templates = [mappedCourse.template];
                        spyOn(courseMapper, 'map').and.returnValue(mappedCourse);
                    });

                    describe('and course does not have sections', function () {

                        it('should resolve promise with duplicated course', function (done) {
                            var promise = repository.duplicateCourse(course.id);

                            promise.fin(function () {
                                expect(promise).toBeResolvedWith(mappedCourse);
                                done();
                            });

                            post.resolve({ course: {} });
                        });

                        it('should add isDuplicated property to course', function(done) {
                            var promise = repository.duplicateCourse(course.id);

                            promise.then(function(data) {
                                expect(data.isDuplicate).toBeTruthy();
                            }).fin(function () {
                                done();
                            });

                            post.resolve({ course: {} });
                        });

                        it('should push duplicated course to dataContext', function (done) {
                            var promise = repository.duplicateCourse(course.id);

                            promise.fin(function () {
                                expect(dataContext.courses[dataContext.courses.length - 1]).toBe(mappedCourse);
                                done();
                            });

                            post.resolve({ course: {} });
                        });

                    });

                    describe('and course have sections', function () {

                        var section = { id: '' },
                            mappedSection = {
                                id: 'SectionId',
                                title: 'obj_title',
                                createdOn: createdOnDate.toISOString(),
                                modifiedOn: createdOnDate.toISOString(),
                                createdBy: 'asasd@ukr.net',
                                questions: []
                            }

                        beforeEach(function () {
                            spyOn(sectionMapper, 'map').and.returnValue(mappedSection);
                            dataContext.sections = [];
                            mappedCourse.sections = [section];
                        });

                        it('should resolve promise with duplicated course', function (done) {
                            var promise = repository.duplicateCourse(course.id);

                            promise.fin(function () {
                                expect(promise).toBeResolvedWith(mappedCourse);
                                done();
                            });

                            post.resolve({ course: {} });
                        });

                        it('should push duplicated course to dataContext', function (done) {
                            var promise = repository.duplicateCourse(course.id);

                            promise.fin(function () {
                                expect(dataContext.courses[dataContext.courses.length - 1]).toBe(mappedCourse);
                                done();
                            });

                            post.resolve({ course: {} });
                        });

                        it('should push sections to dataContext', function (done) {
                            var promise = repository.duplicateCourse(course.id);

                            promise.fin(function () {
                                expect(dataContext.sections[0]).toBe(mappedSection);
                                done();
                            });

                            post.resolve({ course: {}, sections: [section] });
                        });

                    });

                });

            });

        });

    });

    describe('relateSection:', function () {

        it('should be function', function () {
            expect(repository.relateSection).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.relateSection()).toBePromise();
        });

        describe('when course id is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.relateSection(undefined, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not valid');
                    done();
                });
            });

        });

        describe('when course id is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.relateSection(null, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not valid');
                    done();
                });
            });

        });

        describe('when course id is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.relateSection({}, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not valid');
                    done();
                });
            });

        });

        describe('when section id is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.relateSection('asdasdasd', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not valid');
                    done();
                });
            });

        });

        describe('when section id is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.relateSection('asdasdasd', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not valid');
                    done();
                });
            });

        });

        describe('when section id is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.relateSection('asdasdasd', []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not valid');
                    done();
                });
            });

        });

        it('should send request to \'api/course/relateSection\'', function (done) {
            var
                courseId = 'adsasdasd',
                sectionId = 'obj1';

            var promise = repository.relateSection(courseId, sectionId, 5);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/relateSection', { courseId: courseId, sectionId: sectionId, index: 5 });
                done();
            });

            post.reject('He`s dead Jim');
        });

        describe('when sections successfully related on server', function () {

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var
                        courseId = 'adsasdasd',
                        sectionId = 'obj1';

                    var promise = repository.relateSection(courseId, sectionId);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('He`s dead Jim');
                });

            });            

            describe('and course not found in dataContext', function () {

                it('should reject promise', function (done) {
                    var
                        courseId = 'adsasdasd',
                        sectionId = 'obj1';

                    dataContext.courses = [];

                    var promise = repository.relateSection(courseId, sectionId);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course doesn`t exist');
                        done();
                    });

                    post.resolve({});
                });

            });

            it('should add successfully related sections to course in dataContext', function (done) {
                var
                    courseId = 'adsasdasd',
                    sectionId = 'obj1';

                dataContext.courses = [{ id: courseId, sections: [] }];
                dataContext.sections = [{ id: sectionId }];

                var promise = repository.relateSection(courseId, sectionId);

                promise.fin(function () {
                    expect(dataContext.courses[0].sections.length).toEqual(1);
                    expect(dataContext.courses[0].sections[0].id).toEqual(sectionId);
                    done();
                });

                post.resolve({});
            });

            it('should trigger course:sectionRelated event', function (done) {
                var
                    courseId = 'adsasdasd',
                    sectionId = 'obj1';

                dataContext.courses = [{ id: courseId, sections: [] }];
                dataContext.sections = [{ id: sectionId }];

                var promise = repository.relateSection(courseId, sectionId);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalled();
                    expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.course.sectionRelated);
                    expect(app.trigger.calls.mostRecent().args[1]).toEqual(courseId);
                    expect(app.trigger.calls.mostRecent().args[2]).toBeObject();
                    expect(app.trigger.calls.mostRecent().args[2].id).toEqual(sectionId);
                    done();
                });

                post.resolve({});
            });           

        });

    });

    describe('unrelateSections:', function () {

        it('should be function', function () {
            expect(repository.unrelateSections).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.unrelateSections()).toBePromise();
        });

        describe('when course id is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.unrelateSections(undefined, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not valid');
                    done();
                });
            });

        });

        describe('when course id is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.unrelateSections(null, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not valid');
                    done();
                });
            });

        });

        describe('when course id is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.unrelateSections({}, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not valid');
                    done();
                });
            });

        });

        describe('when sections array is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.unrelateSections('asdasdasd', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Sections to relate are not array');
                    done();
                });
            });

        });

        describe('when sections array is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.unrelateSections('asdasdasd', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Sections to relate are not array');
                    done();
                });
            });

        });

        describe('when sections array is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.unrelateSections('asdasdasd', {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Sections to relate are not array');
                    done();
                });
            });

        });

        it('should send request to \'api/course/unrelateSections\'', function (done) {
            var
                courseId = 'adsasdasd',
                sections = [{ id: 'obj1' }, { id: 'obj2' }],
                mappedSections = ['obj1', 'obj2'];

            var promise = repository.unrelateSections(courseId, sections);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/unrelateSections', { courseId: courseId, sections: mappedSections });
                done();
            });

            post.reject('He`s dead Jim');
        });

        describe('when sections successfully unrelated on server', function () {

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var
                        courseId = 'adsasdasd',
                        sections = [{ id: 'obj1' }, { id: 'obj2' }];

                    var promise = repository.unrelateSections(courseId, sections);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('He`s dead Jim');
                });

            });            

            describe('and course not found in dataContext', function () {

                it('should reject promise', function (done) {
                    var
                        courseId = 'adsasdasd',
                        sections = [{ id: 'obj1' }, { id: 'obj2' }];

                    dataContext.courses = [];

                    var promise = repository.unrelateSections(courseId, sections);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course doesn`t exist');
                        done();
                    });

                    post.resolve({});
                });

            });

            it('should remove urelated sections from course in dataContext', function (done) {
                var
                    courseId = 'adsasdasd',
                    sections = [{ id: 'obj1' }, { id: 'obj2' }];

                dataContext.courses = [{ id: courseId, sections: sections }];

                var promise = repository.unrelateSections(courseId, [sections[0]]);

                promise.fin(function () {
                    expect(dataContext.courses[0].sections.length).toEqual(1);
                    expect(dataContext.courses[0].sections[0].id).toEqual(sections[1].id);
                    done();
                });

                post.resolve({});
            });

            it('should trigger course:sectionsUnrelated event', function (done) {
                var
                    courseId = 'adsasdasd',
                    sections = [{ id: 'obj1' }, { id: 'obj2' }];

                dataContext.courses = [{ id: courseId, sections: sections }];

                var promise = repository.unrelateSections(courseId, [sections[0]]);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalled();
                    expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.course.sectionsUnrelated);
                    expect(app.trigger.calls.mostRecent().args[1]).toEqual(courseId);
                    expect(app.trigger.calls.mostRecent().args[2].length).toEqual(1);
                    expect(app.trigger.calls.mostRecent().args[2][0]).toEqual(sections[0].id);
                    done();
                });

                post.resolve({});
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
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/updateTitle', { courseId: courseId, courseTitle: courseTitle });
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

                    post.resolve({});
                });

            });

            it('should update course in dataContext', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    courseTitle = 'dfgjghjdghj',
                    modifiedDate = new Date();

                dataContext.courses = [{ id: courseId, title: ''}];

                var promise = repository.updateCourseTitle(courseId, courseTitle);

                promise.fin(function () {
                    expect(dataContext.courses[0].title).toEqual(courseTitle);
                    done();
                });

                post.resolve({});
            });

            it('should trigger course:titleUpdated event', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    courseTitle = 'dfgjghjdghj',
                    modifiedDate = new Date();

                dataContext.courses = [{ id: courseId, title: '', modifiedOn: modifiedDate }];

                var promise = repository.updateCourseTitle(courseId, courseTitle);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalled();
                    expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.course.titleUpdated);
                    expect(app.trigger.calls.mostRecent().args[1].id).toEqual(courseId);
                    expect(app.trigger.calls.mostRecent().args[1].title).toEqual(courseTitle);
                    expect(app.trigger.calls.mostRecent().args[1].modifiedOn).toEqual(modifiedDate);
                    done();
                });

                post.resolve({});
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
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/updateTemplate', { courseId: courseId, templateId: templateId });
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

                    post.resolve({});
                });

            });

            it('should update course in dataContext', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    templateId = 'dfgjghjdghj';

                dataContext.courses = [{ id: courseId, title: '' }];
                dataContext.templates = [{ id: templateId, name: 'template.name', thumbnail: 'template.image' }];

                var promise = repository.updateCourseTemplate(courseId, templateId);

                promise.fin(function () {
                    expect(dataContext.courses[0].template).toEqual(dataContext.templates[0]);
                    done();
                });

                post.resolve({});
            });

            it('should resolve promise with course template', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    templateId = 'dfgjghjdghj',
                    modifiedDate = new Date(),
                    course = { id: courseId, title: '', modifiedOn: new Date('') };

                dataContext.courses = [course];
                dataContext.templates = [{ id: templateId, name: 'template.name', thumbnail: 'template.image' }];

                var promise = repository.updateCourseTemplate(courseId, templateId);

                promise.fin(function () {
                    expect(promise.inspect().value).toEqual(course.template);
                    done();
                });

                post.resolve({});
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
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/updateintroductioncontent', { courseId: courseId, introductionContent: introductionContent });
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
                    introductionContent = 'dfgjghjdghj';

                dataContext.courses = [{ id: courseId, introductionContent: '' }];

                var promise = repository.updateIntroductionContent(courseId, introductionContent);

                promise.fin(function () {
                    expect(dataContext.courses[0].introductionContent).toEqual(introductionContent);
                    done();
                });

                post.resolve({});
            });

        });

    });

    describe('updateSectionOrder:', function () {

        it('should be function', function () {
            expect(repository.updateSectionOrder).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.updateSectionOrder()).toBePromise();
        });

        describe('when course id is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateSectionOrder(undefined, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not a string');
                    done();
                });
            });

        });

        describe('when course id is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateSectionOrder(null, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not a string');
                    done();
                });
            });

        });

        describe('when course id is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateSectionOrder({}, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id is not a string');
                    done();
                });
            });

        });

        describe('when course id is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateSectionOrder('asdasd', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Sections to relate are not array');
                    done();
                });
            });

        });

        describe('when course id is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateSectionOrder('asdasdasd', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Sections to relate are not array');
                    done();
                });
            });

        });

        describe('when course id is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateSectionOrder('asdasdasd', {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Sections to relate are not array');
                    done();
                });
            });

        });

        it('should send request to \'api/course/updatesectionsorder\'', function (done) {
            var
                courseId = 'qweqeqweqw',
                sections = [{ id: 'obj1' }, { id: 'obj2' }],
                mappedSections = ['obj1', 'obj2'];

            var promise = repository.updateSectionOrder(courseId, sections);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/course/updatesectionsorder', { courseId: courseId, sections: mappedSections });
                done();
            });

            post.reject('He`s dead Jim');
        });

        describe('when sections order successfully saved to server', function () {

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        sections = [{ id: 'obj1' }, { id: 'obj2' }],
                        mappedSections = ['obj1', 'obj2'];

                    var promise = repository.updateSectionOrder(courseId, sections);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response does not an object');
                        done();
                    });

                    post.resolve('He`s dead Jim');
                });

            });

            describe('and course not found in dataContext', function () {

                it('should reject promise', function (done) {
                    var
                        courseId = 'qweqeqweqw',
                        sections = [{ id: 'obj1' }, { id: 'obj2' }],
                        mappedSections = ['obj1', 'obj2'];

                    dataContext.courses = [];

                    var promise = repository.updateSectionOrder(courseId, sections);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course doesn`t exist');
                        done();
                    });

                    post.resolve({});
                });

            });

            it('should update course in data context', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    sections = [{ id: 'obj1' }, { id: 'obj2' }],
                    mappedSections = ['obj1', 'obj2'],
                    modifiedOnDate = new Date();

                dataContext.courses = [{ id: courseId, sections: [sections[1], sections[0]], modifiedOn: modifiedOnDate }];

                var promise = repository.updateSectionOrder(courseId, sections);

                promise.fin(function () {
                    expect(dataContext.courses[0].sections[0].id).toEqual(sections[0].id);
                    expect(dataContext.courses[0].sections[1].id).toEqual(sections[1].id);
                    expect(dataContext.courses[0].modifiedOn).toEqual(modifiedOnDate);
                    done();
                });

                post.resolve({});
            });

            it('should trigger course:sectionsReordered event', function (done) {
                var
                    courseId = 'qweqeqweqw',
                    sections = [{ id: 'obj1' }, { id: 'obj2' }],
                    mappedSections = ['obj1', 'obj2'],
                    modifiedOnDate = new Date();

                dataContext.courses = [{ id: courseId, sections: [sections[1], sections[0]], modifiedOn: modifiedOnDate  }];

                var promise = repository.updateSectionOrder(courseId, sections);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalled();
                    expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.course.sectionsReordered);
                    expect(app.trigger.calls.mostRecent().args[1].id).toEqual(courseId);
                    expect(app.trigger.calls.mostRecent().args[1].modifiedOn).toEqual(modifiedOnDate);
                    expect(app.trigger.calls.mostRecent().args[1].sections[0].id).toEqual(sections[0].id);
                    expect(app.trigger.calls.mostRecent().args[1].sections[1].id).toEqual(sections[1].id);
                    done();
                });

                post.resolve({});
            });

        });

    });

});
