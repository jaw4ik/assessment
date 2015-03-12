﻿define(['viewmodels/courses/courses'], function (viewModel) {
    "use strict";

    var
        app = require('durandal/app'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        dataContext = require('dataContext'),
        userContext = require('userContext'),
        CourseModel = require('models/course'),
        constants = require('constants'),
        localizationManage = require('localization/localizationManager'),
        notify = require('notify'),
        limitCoursesAmount = require('authorization/limitCoursesAmount'),
        uiLocker = require('uiLocker'),
        createCourseCommand = require('commands/createCourseCommand'),
        presentationCourseImportCommand = require('commands/presentationCourseImportCommand')
    ;

    var
        userName = 'user@user.com',
        template = { id: '0', name: 'name', thumbnail: 'img' },
        courses = [
            new CourseModel({
                id: 'testId3',
                title: 'Test Course 3',
                objectives: [],
                template: template,
                createdBy: userName
            }),
            new CourseModel({
                id: 'testId2',
                title: 'Test Course 2',
                objectives: [],
                template: template,
                createdBy: userName
            }),
            new CourseModel({
                id: 'testId1',
                title: 'Test Course 1',
                objectives: [],
                template: template,
                createdBy: userName
            }),
             new CourseModel({
                 id: 'testId4',
                 title: 'Test Course 4',
                 objectives: [],
                 template: template,
                 createdBy: 'someone'
             }),
            new CourseModel({
                id: 'testId5',
                title: 'Test Course 5',
                objectives: [],
                template: template,
                createdBy: 'someone'
            })
        ];

    describe('viewModel [courses]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'replace');
            spyOn(uiLocker, 'lock');
            spyOn(uiLocker, 'unlock');
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('courses:', function () {

            it('should be observable', function () {
                expect(viewModel.courses).toBeObservable();
            });

        });

        describe('isCreateCourseAvailable:', function () {

            it('should be observable', function () {
                expect(viewModel.isCreateCourseAvailable).toBeObservable();
            });

        });

        describe('hasStarterAccess:', function () {

            it('should be boolean', function () {
                expect(viewModel.hasStarterAccess).toBeTruthy();
            });

        });

        describe('currentLanguage', function () {

            it('should be defined', function () {
                expect(viewModel.currentLanguage).toBeDefined();
            });

        });

        describe('activate:', function () {

            var identifyUserDeferred;

            beforeEach(function () {

                dataContext.courses = courses;

                identifyUserDeferred = Q.defer();

                spyOn(userContext, 'identify').and.returnValue(identifyUserDeferred.promise);
            });

            it('should return promise', function () {
                var result = viewModel.activate();
                expect(result).toBePromise();
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set current language', function () {
                viewModel.currentLanguage = null;
                viewModel.activate();
                expect(viewModel.currentLanguage).toBe(localizationManage.currentLanguage);
            });

            it('should identify user', function (done) {

                identifyUserDeferred.resolve();

                viewModel.activate().fin(function () {
                    expect(userContext.identify).toHaveBeenCalled();
                    done();
                });
            });

            describe('when user identified successfully', function () {

                beforeEach(function () {
                    userContext.identity = { email: userName }
                });

                it('should set courses data from dataContext', function (done) {
                    identifyUserDeferred.resolve();
                    viewModel.activate().fin(function () {
                        expect(viewModel.courses().length).toEqual(3);
                        done();
                    });
                });

                it('should set shared courses data from dataContext', function (done) {
                    identifyUserDeferred.resolve();
                    viewModel.activate().fin(function () {
                        expect(viewModel.sharedCourses().length).toEqual(2);
                        done();
                    });
                });

                it('should subscribe on courses array change', function (done) {
                    identifyUserDeferred.resolve();
                    spyOn(viewModel.courses, 'subscribe');

                    viewModel.activate().fin(function () {
                        expect(viewModel.courses.subscribe).toHaveBeenCalled();
                        done();
                    });

                });

                it('should set isCreateCourseAvailable', function (done) {
                    identifyUserDeferred.resolve();
                    spyOn(limitCoursesAmount, 'checkAccess').and.returnValue(false);

                    viewModel.activate().fin(function () {
                        expect(viewModel.isCreateCourseAvailable()).toBe(limitCoursesAmount.checkAccess());
                        done();
                    });
                });

                it('should set hasStarterAccess', function (done) {
                    identifyUserDeferred.resolve();
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);

                    viewModel.activate().fin(function () {
                        expect(viewModel.hasStarterAccess).toBe(userContext.hasStarterAccess());
                        done();
                    });
                });

            });

        });

        describe('createNewCourse:', function () {

            var createCourse;

            beforeEach(function () {
                createCourse = Q.defer();
                spyOn(createCourseCommand, 'execute').and.returnValue(createCourse.promise);
            });

            it('should be a function', function () {
                expect(viewModel.createNewCourse).toBeFunction();
            });

            it('should lock ui', function () {
                viewModel.createNewCourse();
                expect(uiLocker.lock).toHaveBeenCalled();
            });

            it('should execute create course command', function () {
                viewModel.createNewCourse();
                expect(createCourseCommand.execute).toHaveBeenCalledWith('Courses');
            });

            describe('when course created successfully', function () {

                var course = { id: 'courseId' };

                beforeEach(function () {
                    createCourse.resolve(course);
                });

                it('should navigate to the course', function (done) {
                    viewModel.createNewCourse().fin(function () {
                        expect(router.navigate).toHaveBeenCalledWith('#course/courseId');
                        done();
                    });
                });

                it('should unlock ui', function (done) {
                    viewModel.createNewCourse().fin(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when failed to create course', function () {

                beforeEach(function () {
                    createCourse.reject();
                });

                it('should unlock ui', function (done) {
                    viewModel.createNewCourse().fin(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                        done();
                    });
                });
            });

        });

        describe('importCourseFromPresentation:', function () {

            it('should be a function', function () {
                expect(viewModel.importCourseFromPresentation).toBeFunction();
            });

            it('should execute import course command', function () {
                spyOn(presentationCourseImportCommand, 'execute');
                viewModel.importCourseFromPresentation();
                expect(presentationCourseImportCommand.execute).toHaveBeenCalled();
            });

            describe('when course import started', function () {
                beforeEach(function () {
                    spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                        spec.startLoading();
                    });
                });

                it('should unlock ui', function () {
                    viewModel.importCourseFromPresentation();
                    expect(uiLocker.lock).toHaveBeenCalled();
                });
            });

            describe('when course import succeded', function () {
                var course = { id: 'id' };
                beforeEach(function () {
                    spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                        spec.success(course);
                    });
                });

                describe('and course has objective', function() {
                    beforeEach(function() {
                        course.objectives = [{ id: 'objectiveId' }];
                    });

                    it('should navigate to created course', function() {
                        viewModel.importCourseFromPresentation();
                        expect(router.navigate).toHaveBeenCalledWith('#objective/' + course.objectives[0].id + '?courseId=' + course.id);
                    });
                });

                describe('and course does not have objectives', function() {
                    beforeEach(function() {
                        course.objectives = [];
                    });
                    
                    it('should navigate to created course', function() {
                        viewModel.importCourseFromPresentation();
                        expect(router.navigate).toHaveBeenCalledWith('#course/' + course.id);
                    });
                });
                
            });

            describe('when course import completed', function () {
                beforeEach(function () {
                    spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                        spec.complete();
                    });
                });

                it('should unlock ui', function () {
                    viewModel.importCourseFromPresentation();
                    expect(uiLocker.unlock).toHaveBeenCalled();
                });
            });
        });

        describe('navigateToDetails:', function () {

            it('should be a function', function () {
                expect(viewModel.navigateToDetails).toBeFunction();
            });

            it('should send event \"Navigate to course details\"', function () {
                dataContext.courses = courses;
                viewModel.navigateToDetails(courses[0]);
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to course details');
            });

            it('should navigate to #course/id', function () {
                dataContext.courses = courses;
                viewModel.navigateToDetails(courses[0]);
                expect(router.navigate).toHaveBeenCalledWith('course/' + courses[0].id);
            });

        });

        describe('navigateToPublish:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToPublish).toBeFunction();
            });

            it('should send event \'Navigate to publish course\'', function () {
                viewModel.navigateToPublish(courses[0]);
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to publish course');
            });

            it('should navigate to #publish/id', function () {
                viewModel.navigateToPublish(courses[0]);
                expect(router.navigate).toHaveBeenCalledWith('publish/' + courses[0].id);
            });

        });

        describe('toggleSelection:', function () {
            var course;

            beforeEach(function () {
                course = {
                    isSelected: ko.observable()
                };
            });

            it('should be a function', function () {
                expect(viewModel.toggleSelection).toBeFunction();
            });

            it('should select course', function () {
                course.isSelected(false);
                viewModel.toggleSelection(course);
                expect(course.isSelected()).toBe(true);
            });

            it('should send event \"Course unselected\" when was selected', function () {
                course.isSelected(true);
                viewModel.toggleSelection(course);
                expect(eventTracker.publish).toHaveBeenCalledWith('Course unselected');
            });

            it('should send event \"Course selected\" when was not selected', function () {
                course.isSelected(false);
                viewModel.toggleSelection(course);
                expect(eventTracker.publish).toHaveBeenCalledWith('Course selected');
            });

        });

        describe('enableDeleteCourses:', function () {

            it('should be computed', function () {
                expect(viewModel.enableDeleteCourses).toBeComputed();
            });

            describe('when no course is selected', function () {

                it('should be false', function () {
                    viewModel.courses([{ isSelected: ko.observable(false) }]);
                    expect(viewModel.enableDeleteCourses()).toBeFalsy();
                });

            });

            describe('when 1 course is selected', function () {

                it('should be true', function () {
                    viewModel.courses([{ isSelected: ko.observable(true) }]);
                    expect(viewModel.enableDeleteCourses()).toBeTruthy();
                });

            });

            describe('when more than 1 courses are selected', function () {

                it('should be false', function () {
                    viewModel.courses([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                    expect(viewModel.enableDeleteCourses()).toBeTruthy();
                });

            });
        });

        describe('deleteSelectedCourses:', function () {

            it('should be function', function () {
                expect(viewModel.deleteSelectedCourses).toBeFunction();
            });

            it('should send event \'Delete selected courses\'', function () {
                viewModel.courses([{ isSelected: ko.observable(true), objectives: [] }]);
                viewModel.deleteSelectedCourses();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected courses');
            });

            describe('when no courses are selected', function () {

                it('should throw exception', function () {
                    viewModel.courses([]);

                    var f = function () {
                        viewModel.deleteSelectedCourses();
                    };
                    expect(f).toThrow();
                });

            });

            describe('when more that 1 course are selected', function () {

                it('should show error notification', function () {
                    viewModel.courses([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                    spyOn(notify, 'error');

                    viewModel.deleteSelectedCourses();
                    expect(notify.error).toHaveBeenCalled();
                });

            });

            describe('when there is only 1 selected objective', function () {

                var repository = require('repositories/courseRepository');

                var removeCourse;

                beforeEach(function () {
                    removeCourse = Q.defer();
                    spyOn(repository, 'removeCourse').and.returnValue(removeCourse.promise);
                });

                describe('and course has related learning objectives', function () {

                    beforeEach(function () {
                        viewModel.courses([{ isSelected: ko.observable(true), objectives: [{}] }]);
                        spyOn(notify, 'error');
                    });

                    it('should show error notification', function () {
                        viewModel.deleteSelectedCourses();
                        expect(notify.error).toHaveBeenCalled();
                    });

                    it('should not remove course from repository', function () {
                        viewModel.deleteSelectedCourses();
                        expect(repository.removeCourse).not.toHaveBeenCalled();
                    });

                });

                describe('and course has no related learning objectives', function () {

                    beforeEach(function () {
                        viewModel.courses([{ id: 'id', isSelected: ko.observable(true), objectives: [] }]);
                        spyOn(notify, 'saved');
                    });

                    it('should remove course from repository', function () {
                        viewModel.deleteSelectedCourses();
                        expect(repository.removeCourse).toHaveBeenCalledWith('id');
                    });

                    describe('and course was successfully removed from repository', function () {

                        it('should remove course from view model', function (done) {
                            viewModel.deleteSelectedCourses();

                            removeCourse.resolve();

                            removeCourse.promise.fin(function () {
                                expect(viewModel.courses().length).toBe(0);
                                done();
                            });
                        });

                        it('should show saved notification', function (done) {
                            removeCourse.resolve();

                            viewModel.deleteSelectedCourses();

                            removeCourse.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });

                        });

                    });
                });

            });

        });

        describe('courseCollaborationStartedHandler:', function () {
            var course = new CourseModel({
                id: 'testId3',
                title: 'Test Course 3',
                objectives: [],
                template: template,
                createdBy: userName,
                createdOn: new Date(2013, 12, 31)
            });

            var collaboratedCourse = new CourseModel({
                id: 'testId',
                title: 'Test Course',
                objectives: [],
                template: template,
                createdBy: userName,
                createdOn: new Date(2014, 12, 31)
            });

            it('should be function', function () {
                expect(viewModel.courseCollaborationStarted).toBeFunction();
            });

            it('should add course to shared courses', function () {
                viewModel.sharedCourses([]);
                viewModel.courseCollaborationStarted(collaboratedCourse);
                expect(viewModel.sharedCourses().length).toBe(1);
            });

            it('should sort courses by created on date', function () {
                viewModel.sharedCourses([course]);

                viewModel.courseCollaborationStarted(collaboratedCourse);
                expect(viewModel.sharedCourses()[0].id).toBe(collaboratedCourse.id);
                expect(viewModel.sharedCourses()[1].id).toBe(course.id);
            });
        });

        describe('titleUpdated:', function () {
            var courseId = "courseId";
            var vmCourse = {
                id: courseId,
                title: ko.observable(""),
                modifiedOn: ko.observable("")
            };
            var course = {
                id: courseId,
                title: "new title",
                modifiedOn: new Date()
            };

            it('should be function', function () {
                expect(viewModel.titleUpdated).toBeFunction();
            });

            it('should update course title', function () {
                viewModel.courses(vmCourse);
                viewModel.titleUpdated(course);

                expect(vmCourse.title()).toBe(course.title);
            });

            it('should update course modified on date', function () {
                viewModel.courses(vmCourse);
                viewModel.courseUpdated(course);

                expect(vmCourse.modifiedOn().toISOString()).toBe(course.modifiedOn.toISOString());
            });

        });

        describe('courseUpdated:', function () {
            var courseId = "courseId";
            var vmCourse = {
                id: courseId,
                modifiedOn: ko.observable("")
            };
            var course = {
                id: courseId,
                modifiedOn: new Date()
            };

            it('should be function', function () {
                expect(viewModel.courseUpdated).toBeFunction();
            });

            it('should update course modified on date', function () {
                viewModel.courses(vmCourse);
                viewModel.courseUpdated(course);

                expect(vmCourse.modifiedOn().toISOString()).toBe(course.modifiedOn.toISOString());
            });

        });

        describe('deletedByCollaborator:', function () {
            it('should be function', function () {
                expect(viewModel.deletedByCollaborator).toBeFunction();
            });

            it('should delete shared course from list', function () {
                var course = { id: 'id' };
                viewModel.sharedCourses([course]);
                viewModel.deletedByCollaborator(course.id);
                expect(viewModel.sharedCourses().length).toBe(0);
            });
        });

        describe('collaborationFinished:', function () {
            it('should be function', function () {
                expect(viewModel.collaborationFinished).toBeFunction();
            });

            it('should delete shared course from list', function () {
                var course = { id: 'id' };
                viewModel.sharedCourses([course]);
                viewModel.collaborationFinished(course.id);
                expect(viewModel.sharedCourses().length).toBe(0);
            });
        });

        describe('openUpgradePlanUrl:', function () {

            beforeEach(function () {
                spyOn(window, 'open');
            });

            it('should be function', function () {
                expect(viewModel.openUpgradePlanUrl).toBeFunction();
            });

            it('should send event \'Upgrade now\'', function () {
                viewModel.openUpgradePlanUrl();
                expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.courseLimitNotification);
            });

            it('should open upgrade link in new window', function () {
                viewModel.openUpgradePlanUrl();
                expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
            });

        });

    });
}
);