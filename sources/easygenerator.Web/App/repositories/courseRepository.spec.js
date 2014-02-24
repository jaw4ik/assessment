define(['repositories/courseRepository', 'models/course'],
    function (repository, CourseModel) {
        "use strict";

        var
            http = require('plugins/http'),
            httpWrapper = require('httpWrapper'),
            dataContext = require('dataContext'),
            app = require('durandal/app')
        ;

        describe('repository [courseRepository]', function () {

            var post,
                httpWrapperPost;

            beforeEach(function () {
                post = $.Deferred();
                httpWrapperPost = Q.defer();
                spyOn(http, 'post').andReturn(post.promise());
                spyOn(httpWrapper, 'post').andReturn(httpWrapperPost.promise);
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

                it('should send request to server to api/courses', function () {
                    var promise = repository.getCollection();

                    httpWrapperPost.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/courses');
                    });
                });

                describe('and request failed', function () {

                    it('should reject promise with reason', function () {
                        var reason = 'reason';
                        var promise = repository.getCollection();

                        httpWrapperPost.reject(reason);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(reason);
                        });
                    });

                });

                describe('and request succeed', function () {

                    it('should resolve promise with courses collection', function () {
                        var courses = [{ id: 1 }, { id: 2 }];
                        dataContext.courses = courses;

                        var promise = repository.getCollection();
                        httpWrapperPost.resolve(courses);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(courses);
                        });
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

                describe('when id is not a string', function () {

                    it('should reject promise with \'Course id (string) was expected\'', function () {
                        var promise = repository.getById();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Course id (string) was expected');
                        });
                    });

                    it('should not send request to server to api/courseExists', function () {
                        var promise = repository.getById();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when id is a string', function () {
                    var courseId = 'courseId';

                    it('should send request to server to api/courseExists', function () {
                        var promise = repository.getById(courseId);

                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/courseExists', { courseId: courseId });
                        });
                    });

                    describe('and request failed', function () {
                        var reason = 'reason';

                        it('should reject promise with reason', function () {
                            var promise = repository.getById(courseId);
                            httpWrapperPost.reject(reason);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request succeed', function () {

                        describe('and when course does not exist', function () {

                            it('should reject promise with \'Course with this id is not found\'', function () {
                                dataContext.courses = [];
                                var promise = repository.getById('');
                                httpWrapperPost.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Course with this id is not found');
                                });
                            });

                        });

                        describe('and when course exists', function () {

                            it('should be resolved with course from dataContext', function () {
                                var course = { id: '0' };
                                dataContext.courses = [course];

                                var promise = repository.getById('0');
                                httpWrapperPost.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(course);
                                });
                            });

                        });

                    });

                });

            });

            describe('addCourse:', function () {

                it('should be function', function () {
                    expect(repository.addCourse).toBeFunction();
                });

                it('should return promise', function () {
                    expect(repository.addCourse()).toBePromise();
                });

                describe('when course title is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.addCourse(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Title is not a string');
                        });
                    });

                    it('should not send request to server', function () {
                        var promise = repository.addCourse(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when course templateId is not a string', function () {
                    var title = "title";

                    it('should reject promise', function () {
                        var promise = repository.addCourse(title, null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('TemplateId is not a string');
                        });
                    });

                    it('should not send request to server', function () {
                        var promise = repository.addCourse(title, null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when course title and templateId are strings', function () {
                    var title = 'title';
                    var templateId = 'templateId';

                    it('should send request to server to api/course/create', function () {
                        var promise = repository.addCourse(title, templateId);

                        httpWrapperPost.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/course/create', { title: title, templateId: templateId });
                        });
                    });

                    describe('and send request to server', function () {

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var promise = repository.addCourse(title, templateId);

                                httpWrapperPost.reject();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejected();
                                });
                            });

                        });

                        describe('and request succeed', function () {

                            describe('and response is undefined', function () {

                                it('should reject promise with \'Response is not an object\'', function () {
                                    var promise = repository.addCourse(title, templateId);

                                    httpWrapperPost.resolve();

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response is not an object');
                                    });
                                });

                            });

                            describe('and response is null', function () {

                                it('should reject promise with \'Response is not an object\'', function () {
                                    var promise = repository.addCourse(title, templateId);

                                    httpWrapperPost.resolve(null);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response is not an object');
                                    });
                                });

                            });

                            describe('and response is an object', function () {

                                describe('and response Id is undefined', function () {

                                    beforeEach(function () {
                                        httpWrapperPost.resolve({});
                                    });

                                    it('should reject promise with \'Response Id is not a string\'', function () {
                                        var promise = repository.addCourse(title, templateId);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Response Id is not a string');
                                        });
                                    });

                                });

                                describe('and response Id is null', function () {

                                    beforeEach(function () {
                                        httpWrapperPost.resolve({ Id: null });
                                    });

                                    it('should reject promise with \'Response Id is not a string\'', function () {
                                        var promise = repository.addCourse(title, templateId);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Response Id is not a string');
                                        });
                                    });

                                });

                                describe('and response Id is object', function () {

                                    describe('and response CreatedOn is null', function () {

                                        beforeEach(function () {
                                            httpWrapperPost.resolve({ Id: '0', CreatedOn: null });
                                        });

                                        it('should reject promise \'Response CreatedOn is not a string\'', function () {
                                            var promise = repository.addCourse(title, templateId);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith('Response CreatedOn is not a string');
                                            });
                                        });

                                    });

                                    describe('and response CreatedOn is undefined', function () {

                                        beforeEach(function () {
                                            httpWrapperPost.resolve({ Id: 'id' });
                                        });

                                        it('should reject promise with \'Response CreatedOn is not a string\'', function () {
                                            var promise = repository.addCourse(title, templateId);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith('Response CreatedOn is not a string');
                                            });
                                        });
                                    });

                                    describe('and response CreatedOn is object', function () {
                                        var courseId = 'courseId';
                                        var courseCreatedOn = '/Date(1378106938845)/';

                                        beforeEach(function () {
                                            httpWrapperPost.resolve({ Id: courseId, CreatedOn: courseCreatedOn });
                                        });

                                        describe('and template not found in dataContext', function () {

                                            beforeEach(function () {
                                                dataContext.templates = [];
                                            });

                                            it('should reject promise with \'Template does not exist in dataContext\'', function () {
                                                var promise = repository.addCourse(title, templateId);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeRejectedWith('Template does not exist in dataContext');
                                                });
                                            });

                                        });

                                        describe('and template found in dataContext', function () {
                                            var template;
                                            beforeEach(function () {
                                                template = { id: templateId, name: 'template name', image: 'template image' };
                                                dataContext.templates = [template];
                                            });

                                            it('should resolve promise with course', function () {
                                                var promise = repository.addCourse(title, templateId);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    var course = promise.inspect().value;
                                                    expect(course.id).toBe(courseId);
                                                    expect(course.createdOn).toEqual(utils.getDateFromString(courseCreatedOn));
                                                });
                                            });

                                            it('should add course to dataContext', function () {

                                                dataContext.courses = [];

                                                var promise = repository.addCourse(title, templateId);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(dataContext.courses.length).toEqual(1);
                                                    expect(dataContext.courses[0]).toEqual(new CourseModel({
                                                        id: courseId,
                                                        title: title,
                                                        template: template,
                                                        createdOn: utils.getDateFromString(courseCreatedOn),
                                                        modifiedOn: utils.getDateFromString(courseCreatedOn),
                                                        objectives: []
                                                    }));
                                                });

                                            });

                                            it('should trigger event \'course:created\'', function () {
                                                var promise = repository.addCourse(title, templateId);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(app.trigger).toHaveBeenCalledWith('course:created', new CourseModel({
                                                        id: courseId,
                                                        title: title,
                                                        template: template,
                                                        createdOn: utils.getDateFromString(courseCreatedOn),
                                                        modifiedOn: utils.getDateFromString(courseCreatedOn),
                                                        objectives: []
                                                    }));
                                                });
                                            });

                                        });

                                    });
                                });

                            });

                        });

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

                describe('when course id is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.removeCourse();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                    it('should not send request to server to api/course/delete', function () {
                        var promise = repository.removeCourse();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when course id is a string', function () {

                    it('should send request to server to api/course/delete', function () {
                        var courseId = 'id';
                        var promise = repository.removeCourse(courseId);

                        httpWrapperPost.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/course/delete', {
                                courseId: courseId
                            });
                        });
                    });

                    describe('and send request to server', function () {

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var reason = 'reason';
                                var promise = repository.removeCourse('id');

                                httpWrapperPost.reject(reason);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith(reason);
                                });
                            });

                        });

                        describe('and request succeed', function () {

                            describe('and response is an object', function () {

                                it('should resolve promise', function () {
                                    var promise = repository.removeCourse('id');

                                    httpWrapperPost.resolve();

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeResolved();
                                    });
                                });

                                it('should remove course from dataContext', function () {
                                    var courseId = 'id';
                                    dataContext.courses = [{ id: 'id' }];
                                    httpWrapperPost.resolve();
                                    var promise = repository.removeCourse(courseId);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(dataContext.courses.length).toEqual(0);
                                    });
                                });

                                it('should trigger event \'course:deleted\'', function () {
                                    var promise = repository.removeCourse('id');

                                    httpWrapperPost.resolve();

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(app.trigger).toHaveBeenCalledWith('course:deleted', 'id');
                                    });
                                });

                            });

                        });

                    });

                });

            });

            describe('relateObjectives:', function () {

                it('should be function', function () {
                    expect(repository.relateObjectives).toBeFunction();
                });

                it('should return promise', function () {
                    var result = repository.relateObjectives('0', []);
                    expect(result).toBePromise();
                });

                describe('when argument \"courseId\" is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.relateObjectives({});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"objectives\" is not an array', function () {

                    it('should reject promise', function () {
                        var promise = repository.relateObjectives('some course Id', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when arguments are valid', function () {

                    var course;
                    var objectives;

                    beforeEach(function () {
                        course = { id: "SomeCourseId" };
                        objectives = [{ id: "SomeObjectiveId1" }, { id: "SomeObjectiveId2" }];
                    });

                    it('should send request to server', function () {
                        var promise = repository.relateObjectives(course.id, objectives);
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalled();
                        });
                    });

                    describe('and request to server failed', function () {

                        it('should reject promise', function () {
                            var promise = repository.relateObjectives(course.id, objectives);
                            httpWrapperPost.reject('Some reason');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Some reason');
                            });
                        });

                    });

                    describe('and request to server succeed', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise with \'Response is not an object\'', function () {
                                var promise = repository.relateObjectives(course.id, objectives);
                                httpWrapperPost.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response has no midifiedOn date', function () {

                            it('should reject promise with \'Response does not have modification date\'', function () {
                                var promise = repository.relateObjectives(course.id, objectives);
                                httpWrapperPost.resolve({});

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have modification date');
                                });
                            });

                        });

                        describe('and response has no relatedObjectives collection', function () {

                            it('should reject promise with \'Response does not have related objectives collection\'', function () {
                                var promise = repository.relateObjectives(course.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have related objectives collection');
                                });
                            });

                        });

                        describe('and course doesn`t exist in dataContext', function () {

                            it('should reject promise', function () {
                                dataContext.courses = [];
                                var promise = repository.relateObjectives(course.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/', RelatedObjectives: [] });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Course doesn`t exist');
                                });
                            });

                        });

                        describe('and course exists in dataContext', function () {

                            beforeEach(function () {
                                dataContext.courses = [{ id: course.id, modifiedOn: new Date(), objectives: [] }];
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/', RelatedObjectives: [{ Id: objectives[0].id }] });
                            });

                            it('should update expereince modifiedOn date', function () {
                                var promise = repository.relateObjectives(course.id, objectives);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.courses[0].modifiedOn).toEqual(utils.getDateFromString('/Date(1378106938845)/'));
                                });
                            });

                            it('should relate objectives to course', function () {
                                var promise = repository.relateObjectives(course.id, objectives);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.courses[0].objectives).toEqual([objectives[0]]);
                                });
                            });

                            it('should resolve promise with modification date and related objectives collection', function () {
                                var promise = repository.relateObjectives(course.id, objectives);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith({
                                        modifiedOn: utils.getDateFromString('/Date(1378106938845)/'),
                                        relatedObjectives: [{ id: objectives[0].id }]
                                    });
                                });
                            });

                            it('should trigger event \'course:objectivesRelated\'', function () {
                                var promise = repository.relateObjectives(course.id, objectives);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(app.trigger).toHaveBeenCalledWith('course:objectivesRelated', course.id, [objectives[0]]);
                                });
                            });

                        });

                    });

                });

            });

            describe('unrelateObjectives', function () {

                it('should be a function', function () {
                    expect(repository.unrelateObjectives).toBeFunction();
                });

                it('should return promise', function () {
                    var result = repository.unrelateObjectives('0', []);
                    expect(result).toBePromise();
                });

                describe('when argument \"courseId\" is undefined', function () {

                    it('should reject pomise', function () {
                        var promise = repository.unrelateObjectives();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"courseId\" is null', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"courseId\" is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives({});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"objectives\" is undefined', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives('some course Id');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"objectives\" is null', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives('some course Id', null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"objectives\" is not an array', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives('some course Id', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when all arguments are valid', function () {
                    var course;
                    var objectives;

                    beforeEach(function () {
                        course = { id: "SomeCourseId" };
                        objectives = [{ id: "SomeObjectiveId1" }, { id: "SomeObjectiveId2" }];
                    });

                    it('should send request to server', function () {
                        var promise = repository.unrelateObjectives(course.id, objectives);
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalled();
                        });
                    });

                    describe('and request to server failed', function () {

                        it('should reject promise', function () {
                            var promise = repository.unrelateObjectives(course.id, objectives);
                            httpWrapperPost.reject('Some reason');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Some reason');
                            });
                        });

                    });

                    describe('and request to server succeed', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise', function () {
                                var promise = repository.unrelateObjectives(course.id, objectives);
                                httpWrapperPost.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response has no midifiedOn date', function () {

                            it('should reject promise', function () {
                                var promise = repository.unrelateObjectives(course.id, objectives);
                                httpWrapperPost.resolve({});

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have modification date');
                                });
                            });

                        });

                        describe('and course doesn`t exist in dataContext', function () {

                            it('should reject promise', function () {
                                dataContext.courses = [];
                                var promise = repository.unrelateObjectives(course.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/', RelatedObjectives: {} });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Course doesn`t exist');
                                });
                            });

                        });

                        describe('and course exists in dataContext', function () {

                            beforeEach(function () {
                                dataContext.courses = [{ id: course.id, modifiedOn: new Date(), objectives: [] }];
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/' });
                            });

                            it('should update expereince modifiedOn date', function () {
                                var promise = repository.unrelateObjectives(course.id, objectives);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.courses[0].modifiedOn).toEqual(utils.getDateFromString('/Date(1378106938845)/'));
                                });
                            });

                            it('should unrelate objectives from course', function () {
                                var promise = repository.unrelateObjectives(course.id, objectives);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.courses[0].objectives).toEqual([]);
                                });
                            });

                            it('should resolve promise with modification date', function () {
                                var promise = repository.unrelateObjectives(course.id, objectives);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(utils.getDateFromString('/Date(1378106938845)/'));
                                });
                            });

                            it('should trigger event \'course:objectivesUnrelated\'', function () {
                                var promise = repository.unrelateObjectives(course.id, objectives);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(app.trigger).toHaveBeenCalledWith('course:objectivesUnrelated', course.id, [objectives[0].id, objectives[1].id]);
                                });

                            });

                        });

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

                describe('when courseId is not a string', function () {

                    it('should reject promise with reason \'Course id is not a string\'', function () {
                        var promise = repository.updateCourseTitle({}, 'Some title');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Course id is not a string');
                        });
                    });

                });

                describe('when courseTitle is not a string', function () {

                    it('should reject promise with reason \'Course title is not a string\'', function () {
                        var promise = repository.updateCourseTitle('Some id', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Course title is not a string');
                        });
                    });

                });

                describe('when courseId and courseTitle are strings', function () {

                    it('should send request to /api/course/updateTitle', function () {
                        var courseId = 'Some id',
                            courseTitle = 'Some title';
                        var promise = repository.updateCourseTitle(courseId, courseTitle);
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/course/updateTitle', jasmine.any(Object));
                            expect(httpWrapper.post.mostRecentCall.args[1].courseId).toEqual(courseId);
                            expect(httpWrapper.post.mostRecentCall.args[1].courseTitle).toEqual(courseTitle);
                        });
                    });

                    describe('and request fails', function () {

                        it('should reject promise', function () {
                            var reason = 'Some reason';
                            var promise = repository.updateCourseTitle('Some id', 'Some title');
                            httpWrapperPost.reject(reason);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request successful', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise with \'Response is not an object\'', function () {
                                var promise = repository.updateCourseTitle('Some id', 'Some title');
                                httpWrapperPost.resolve('Not an object');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response is an object', function () {

                            describe('and doesn`t have ModifiedOn date', function () {

                                it('should reject promise with \'Response does not have modification date\'', function () {
                                    var promise = repository.updateCourseTitle('Some id', 'Some title');
                                    httpWrapperPost.resolve({});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                    });
                                });

                            });

                            describe('and have ModifiedOn date', function () {

                                describe('and course not found in dataContext', function () {

                                    it('should reject promise with \'Course does not exist in dataContext\'', function () {
                                        dataContext.courses = [];
                                        var promise = repository.updateCourseTitle('Some id', 'Some title');
                                        httpWrapperPost.resolve({ ModifiedOn: "/Date(1378106938845)/" });

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Course does not exist in dataContext');
                                        });
                                    });

                                });

                                describe('and course found in dataContext', function () {

                                    var
                                        newTitle = 'Some new title',
                                        newModifiedOnDate = "/Date(1378106938845)/",
                                        parsedNewModifiedOnDate = new Date(parseInt(newModifiedOnDate.substr(6), 10)),
                                        course = {
                                            id: 'Some id',
                                            title: 'Original title',
                                            modifiedOn: 'Some date'
                                        }
                                    ;

                                    beforeEach(function () {
                                        dataContext.courses = [course];
                                        httpWrapperPost.resolve({ ModifiedOn: newModifiedOnDate });
                                    });

                                    it('should update course title', function () {
                                        var promise = repository.updateCourseTitle(course.id, newTitle);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(course.title).toEqual(newTitle);
                                        });
                                    });

                                    it('should update course modifiedOn date', function () {
                                        var promise = repository.updateCourseTitle(course.id, newTitle);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(course.modifiedOn).toEqual(parsedNewModifiedOnDate);
                                        });
                                    });

                                    it('should resolve promise with modifiedOn date', function () {
                                        var promise = repository.updateCourseTitle(course.id, newTitle);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolvedWith(parsedNewModifiedOnDate);
                                        });
                                    });

                                    it('should trigger event \'course:titleUpdated\'', function () {
                                        var promise = repository.updateCourseTitle(course.id, newTitle);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(app.trigger).toHaveBeenCalledWith('course:titleUpdated', course);
                                        });
                                    });

                                });

                            });

                        });

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

                describe('when courseId is not a string', function () {

                    it('should reject promise with reason \'Course id is not a string\'', function () {
                        var promise = repository.updateCourseTemplate({}, 'Some title');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Course id is not a string');
                        });
                    });

                });

                describe('when templateId is not a string', function () {

                    it('should reject promise with reason \'Template id is not a string\'', function () {
                        var promise = repository.updateCourseTemplate('Some id', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Template id is not a string');
                        });
                    });

                });

                describe('when courseId and templateId are strings', function () {

                    it('should send request to /api/course/updateTemplate', function () {
                        var courseId = 'Some id',
                            templateId = 'Some template id';
                        var promise = repository.updateCourseTemplate(courseId, templateId);
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/course/updateTemplate', jasmine.any(Object));
                            expect(httpWrapper.post.mostRecentCall.args[1].courseId).toEqual(courseId);
                            expect(httpWrapper.post.mostRecentCall.args[1].templateId).toEqual(templateId);
                        });
                    });

                    describe('and request fails', function () {

                        it('should reject promise', function () {
                            var reason = 'Some reason';
                            var promise = repository.updateCourseTemplate('Some id', 'Some template id');
                            httpWrapperPost.reject(reason);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request successful', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise with \'Response is not an object\'', function () {
                                var promise = repository.updateCourseTemplate('Some id', 'Some template id');
                                httpWrapperPost.resolve('Not an object');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response is an object', function () {

                            describe('and doesn`t have ModifiedOn date', function () {

                                it('should reject promise with \'Response does not have modification date\'', function () {
                                    var promise = repository.updateCourseTemplate('Some id', 'Some template id');
                                    httpWrapperPost.resolve({});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                    });
                                });

                            });

                            describe('and have ModifiedOn date', function () {

                                var newModifiedOnDate;
                                beforeEach(function () {
                                    newModifiedOnDate = "/Date(1378106938845)/";
                                    httpWrapperPost.resolve({ ModifiedOn: newModifiedOnDate });
                                });

                                describe('and course not found in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.courses = [];
                                    });

                                    it('should reject promise with \'Course does not exist in dataContext\'', function () {
                                        var promise = repository.updateCourseTemplate('Some id', 'Some template id');

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Course does not exist in dataContext');
                                        });
                                    });

                                });

                                describe('and course found in dataContext', function () {
                                    var course;
                                    beforeEach(function () {
                                        course = {
                                            id: 'Some id',
                                            title: 'Original title',
                                            modifiedOn: 'Some date'
                                        };

                                        dataContext.courses = [course];
                                    });

                                    describe('and template not found in dataContext', function () {

                                        beforeEach(function () {
                                            dataContext.templates = [];
                                        });

                                        it('should reject promise with \'Template does not exist in dataContext\'', function () {
                                            var promise = repository.updateCourseTemplate('Some id', 'Some template id');

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith('Template does not exist in dataContext');
                                            });
                                        });

                                    });

                                    describe('and template found in dataContext', function () {
                                        var template;
                                        beforeEach(function () {
                                            template = { id: 'template id', name: 'template name', image: 'template image' };
                                            dataContext.templates = [template];
                                        });

                                        it('should update course template', function () {
                                            var promise = repository.updateCourseTemplate(course.id, template.id);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(course.template).toEqual(template);
                                            });
                                        });

                                        it('should update course modifiedOn date', function () {
                                            var promise = repository.updateCourseTemplate(course.id, template.id);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(course.modifiedOn).toEqual(utils.getDateFromString(newModifiedOnDate));
                                            });
                                        });

                                        it('should resolve promise with modifiedOn date', function () {
                                            var promise = repository.updateCourseTemplate(course.id, template.id);
                                            httpWrapperPost.resolve({ ModifiedOn: newModifiedOnDate });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolvedWith({ modifiedOn: utils.getDateFromString(newModifiedOnDate) });
                                            });
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('updateIntroductionContent:', function () {

                it('should be function', function () {
                    expect(repository.updateIntroductionContent).toBeFunction();
                });

                it('should return promise', function () {
                    expect(repository.updateIntroductionContent('courseId')).toBePromise();
                });

                describe('when courseId is not a string', function () {

                    it('should reject promise with reason \'Course id is not a string\'', function () {
                        var promise = repository.updateIntroductionContent({}, 'Some content');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Course id is not a string');
                        });
                    });

                });

                describe('when course id is string', function () {

                    it('should send request to /api/course/updateintroductioncontent', function () {
                        var courseId = 'Some id';
                        var promise = repository.updateIntroductionContent(courseId, 'some content');
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/course/updateintroductioncontent', jasmine.any(Object));
                            expect(httpWrapper.post.mostRecentCall.args[1].courseId).toEqual(courseId);
                            expect(httpWrapper.post.mostRecentCall.args[1].introductionContent).toEqual('some content');
                        });
                    });

                    describe('and request fail', function () {

                        it('should reject promise', function () {
                            var reason = 'Some reason';
                            var promise = repository.updateIntroductionContent('Some id', 'Some content');
                            httpWrapperPost.reject(reason);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request successful', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise with \'Response is not an object\'', function () {
                                var promise = repository.updateIntroductionContent('Some id', 'Some content');
                                httpWrapperPost.resolve('');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response is object', function () {

                            describe('and when ModifiedOn is not a string', function () {

                                it('should reject promise with \'Response does not have modification date\'', function () {

                                    var promise = repository.updateIntroductionContent('some id', 'some content');
                                    httpWrapperPost.resolve({ ModifiedOn: 1 });

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                    });

                                });

                            });

                            describe('and when ModifiedOn is a string', function () {

                                var newModifiedDate;

                                beforeEach(function () {
                                    newModifiedDate = "/Date(1378106938845)/";
                                    httpWrapperPost.resolve({ ModifiedOn: newModifiedDate });
                                });

                                describe('and when course is not found in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.courses = [];
                                    });

                                    it('should reject promise with \'Course does not exist in dataContext\'', function () {
                                        var promise = repository.updateIntroductionContent('someid', 'some content');
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Course does not exist in dataContext');
                                        });
                                    });

                                });

                                describe('and when course is found in dataContext', function () {

                                    var course;

                                    beforeEach(function () {
                                        course = {
                                            id: 'Some id',
                                            title: 'Original title',
                                            modifiedOn: 'Some date'
                                        };

                                        dataContext.courses = [course];
                                    });

                                    it('should update content in course', function () {
                                        var promise = repository.updateIntroductionContent(course.id, 'some content');

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(course.introductionContent).toBe('some content');
                                        });
                                    });

                                    it('should update modifiedDate', function () {
                                        var promise = repository.updateIntroductionContent(course.id, 'some content');

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(course.modifiedOn).toEqual(utils.getDateFromString(newModifiedDate));
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('updateObjectiveOrder', function () {

                it('should be function', function () {
                    expect(repository.updateObjectiveOrder).toBeFunction();
                });

                it('should return promise', function () {
                    expect(repository.updateObjectiveOrder()).toBePromise();
                });

                describe('when courseId is not a string', function () {

                    it('should reject promise with reason \'Course id is not a string\'', function () {
                        var promise = repository.updateObjectiveOrder({}, 'Some content');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Course id is not a string');
                        });
                    });

                });

                describe('when course id is string', function () {

                    describe('when objectives is not an array', function () {

                        it('should reject promise', function () {
                            var promise = repository.updateObjectiveOrder('some course Id', {});

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Objectives to relate are not array');
                            });
                        });

                    });

                    describe('when objectives is an array', function () {
                        var objectives, sortedCollection;

                        beforeEach(function () {
                            objectives = [
                                {
                                    0: {
                                        id: 1
                                    }
                                }
                            ];

                            sortedCollection = _.map(objectives, function (item) {
                                return item.id;
                            });
                        });

                        it('should send request to /api/course/updateobjectivesorder', function () {
                            var courseId = 'Some id';
                            var promise = repository.updateObjectiveOrder(courseId, objectives);
                            httpWrapperPost.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(httpWrapper.post).toHaveBeenCalledWith('api/course/updateobjectivesorder', jasmine.any(Object));
                                expect(httpWrapper.post.mostRecentCall.args[1].courseId).toEqual(courseId);
                                expect(httpWrapper.post.mostRecentCall.args[1].objectives).toEqual(sortedCollection);
                            });
                        });

                        describe('and request fail', function () {

                            it('should reject promise', function () {
                                var reason = 'some message';
                                var promise = repository.updateObjectiveOrder('some id', objectives);
                                httpWrapperPost.reject(reason);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith(reason);
                                });
                            });

                        });

                        describe('and request success', function () {

                            describe('and response is not an object', function () {

                                it('should reject promise with \'Response does not an object\'', function () {
                                    var promise = repository.updateObjectiveOrder('some id', objectives);
                                    httpWrapperPost.resolve(null);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response does not an object');
                                    });
                                });

                            });

                            describe('and response is an object', function () {

                                describe('and response.ModifiedOn is not a string', function () {

                                    it('should reject promise with \'Response does not have modification date\'', function () {
                                        var promise = repository.updateObjectiveOrder('some id', objectives);
                                        httpWrapperPost.resolve({ ModifiedOn: null });

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Response does not have modification date');
                                        });
                                    });

                                });

                                describe('and response.ModifiedOn is a string', function () {

                                    var newModifiedDate;

                                    beforeEach(function () {
                                        newModifiedDate = "/Date(1378106938845)/";
                                        httpWrapperPost.resolve({ ModifiedOn: newModifiedDate });
                                    });


                                    describe('and when course is not found in dataContext', function () {

                                        beforeEach(function () {
                                            dataContext.courses = [];
                                        });

                                        it('should reject promise with \'Course doesn`t exist\'', function () {
                                            var promise = repository.updateObjectiveOrder('someid', objectives);
                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith('Course doesn`t exist');
                                            });
                                        });

                                    });

                                    describe('and when course is found in dataContext', function () {

                                        var course;

                                        beforeEach(function () {
                                            course = {
                                                id: 'Some id',
                                                title: 'Original title',
                                                modifiedOn: 'Some date1'
                                            };
                                            dataContext.courses = [course];
                                        });

                                        it('should update modifiedDate', function () {
                                            var promise = repository.updateObjectiveOrder(course.id, objectives);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(course.modifiedOn).toEqual(utils.getDateFromString(newModifiedDate));
                                            });
                                        });

                                        it('should trigger course:objectivesReordered', function () {
                                            var promise = repository.updateObjectiveOrder(course.id, objectives);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(app.trigger).toHaveBeenCalledWith('course:objectivesReordered', course);
                                            });
                                        });

                                    });

                                });

                            });

                        });
                    });

                });

            });
        });

    });
