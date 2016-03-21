import viewModel from './courses';

import router from 'plugins/router';
import eventTracker from 'eventTracker';
import dataContext from 'dataContext';
import userContext from 'userContext';
import CourseModel from 'models/course';
import constants from 'constants';
import localizationManage from 'localization/localizationManager';
import limitCoursesAmount from 'authorization/limitCoursesAmount';
import uiLocker from 'uiLocker';
import presentationCourseImportCommand from 'commands/presentationCourseImportCommand';
import duplicateCourseCommand from 'commands/duplicateCourseCommand';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import waiter from 'utils/waiter';
import createCourseDialog from 'dialogs/course/createCourse/createCourse';
import deleteCourseDialog from 'dialogs/course/delete/deleteCourse';
import stopCollaborationDialog from 'dialogs/course/stopCollaboration/stopCollaboration';

var
    userName = 'user@user.com',
    template = { id: '0', name: 'name', thumbnail: 'img' },
    courses = [
        new CourseModel({
            id: 'testId3',
            title: 'Test Course 3',
            sections: [],
            template: template,
            createdBy: userName
        }),
        new CourseModel({
            id: 'testId2',
            title: 'Test Course 2',
            sections: [],
            template: template,
            createdBy: userName
        }),
        new CourseModel({
            id: 'testId1',
            title: 'Test Course 1',
            sections: [],
            template: template,
            createdBy: userName
        }),
         new CourseModel({
             id: 'testId4',
             title: 'Test Course 4',
             sections: [],
             template: template,
             createdBy: 'someone'
         }),
        new CourseModel({
            id: 'testId5',
            title: 'Test Course 5',
            sections: [],
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

    describe('currentLanguage', function () {

        it('should be defined', function () {
            expect(viewModel.currentLanguage).toBeDefined();
        });

    });

    describe('currentCoursesLimit', function () {

        beforeEach(function() {
            spyOn(limitCoursesAmount, 'getCurrentLimit').and.returnValue(10);
        });

        it('should be defined', function() {
            expect(viewModel.currentCoursesLimit).toBeDefined();
        });

        it('should be equal current courses limit', function () {
            expect(viewModel.currentCoursesLimit).toBe(10);
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

        });

    });

    describe('createCourseCallback', function () {

        it('should be function', function () {
            expect(viewModel.createCourseCallback).toBeFunction();
        });

        it('should navigate to course page', function () {
            viewModel.createCourseCallback({ id: 'id' });
            expect(router.navigate).toHaveBeenCalledWith('courses/id');
        });

    });

    describe('createNewCourse:', function () {

        beforeEach(function () {
            spyOn(createCourseDialog, 'show');
        });

        it('should publish event', function () {
            viewModel.createNewCourse();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open \'Create course\' dialog');
        });

        it('should call showing create course dialog with callback', function () {
            viewModel.createNewCourse();
            expect(createCourseDialog.show).toHaveBeenCalledWith(viewModel.createCourseCallback);
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

            describe('and course has section', function () {
                beforeEach(function () {
                    course.sections = [{ id: 'sectionId' }];
                });

                it('should navigate to created course', function () {
                    viewModel.importCourseFromPresentation();
                    expect(router.navigate).toHaveBeenCalledWith('courses/' + course.id + '/sections/' + course.sections[0].id);
                });
            });

            describe('and course does not have sections', function () {
                beforeEach(function () {
                    course.sections = [];
                });

                it('should navigate to created course', function () {
                    viewModel.importCourseFromPresentation();
                    expect(router.navigate).toHaveBeenCalledWith('courses/' + course.id);
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
            expect(router.navigate).toHaveBeenCalledWith('courses/' + courses[0].id);
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
            expect(router.navigate).toHaveBeenCalledWith('courses/' + courses[0].id + '/publish');
        });

    });

    describe('duplicateCourse:', function () {
        var dfd,
            waiterDfd;

        beforeEach(function () {
            dfd = Q.defer();
            waiterDfd = Q.defer();
            spyOn(duplicateCourseCommand, 'execute').and.returnValue(dfd.promise);
            spyOn(upgradeDialog, 'show');
            spyOn(waiter, 'waitTime').and.returnValue(waiterDfd.promise);
        });

        it('should be function', function () {
            expect(viewModel.duplicateCourse).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.duplicateCourse()).toBePromise();
        });

        describe('when creating course is not available', function () {

            beforeEach(function () {
                viewModel.isCreateCourseAvailable(false);
            });

            it('should show upgrade dialog', function (done) {
                var promise = viewModel.duplicateCourse();

                promise.fin(function () {
                    expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.duplicateCourse);
                    done();
                });

            });

        });

        describe('when creating course is available', function () {

            var course = {
                id: '',
                title: ko.observable(''),
                thumbnail: '',
                createdOn: new Date(),
                modifiedOn: new Date(),
                isSelected: ko.observable(false),
                sections: [],
                isProcessed: true
            };

            beforeEach(function () {
                viewModel.isCreateCourseAvailable(true);
                viewModel.courses([]);
            });

            it('should add fake course to the top of the course list', function (done) {
                var promise = viewModel.duplicateCourse(course);

                promise.fin(function () {
                    expect(viewModel.courses()[0].title).toBe(course.title());
                    expect(viewModel.courses()[0].thumbnail).toBe(course.thumbnail);
                    expect(viewModel.courses()[0].isSelected()).toBe(course.isSelected());
                    expect(viewModel.courses()[0].sections).toBe(course.sections);
                    expect(viewModel.courses()[0].isProcessed).toBeFalsy();
                    expect(viewModel.courses()[0].isDuplicatingFinished()).toBeFalsy();
                    expect(viewModel.courses()[0].finishDuplicating).toBeFalsy();
                    done();
                });

                dfd.reject();

            });

            it('should set to fake course a function for removing fake course and adding duplicated course after minimal duplicating time', function (done) {
                var resolvedCourse = {
                    id: 'new',
                    title: '',
                    template: { thumbnail: '' },
                    modifiedOn: new Date(),
                    createdOn: new Date(),
                    sections: []
                }

                var promise = viewModel.duplicateCourse(course);

                promise.fin(function () {

                    expect(viewModel.courses()[0].isDuplicatingFinished()).toBeTruthy();

                    viewModel.courses()[0].finishDuplicating();

                    expect(viewModel.courses()[0].id).toBe(resolvedCourse.id);
                    expect(viewModel.courses()[0].title()).toBe(resolvedCourse.title);
                    expect(viewModel.courses()[0].thumbnail).toBe(resolvedCourse.template.thumbnail);
                    expect(viewModel.courses()[0].sections).toBe(resolvedCourse.sections);
                    expect(viewModel.courses()[0].isSelected()).toBeFalsy();
                    expect(viewModel.courses()[0].isProcessed).toBeTruthy();
                    done();
                });

                dfd.resolve(resolvedCourse);
                waiterDfd.resolve();
            });

        });

    });
        
    describe('deleteCourse:', function () {
        var course = {
            id: '0',
            title: ko.observable('title')
        };

        beforeEach(function () {
            spyOn(deleteCourseDialog, 'show');
        });

        it('should send event \'Delete course\'', function () {
            viewModel.deleteCourse(course);
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete course');
        });

        it('should show deleteCourse dialog', function() {
            viewModel.deleteCourse(course);
            expect(deleteCourseDialog.show).toHaveBeenCalledWith(course.id, course.title());
        });
    });

    describe('stopCollaboration:', function () {
        var course = {
            id: '0',
            title: ko.observable('title')
        };

        beforeEach(function () {
            spyOn(stopCollaborationDialog, 'show');
        });

        it('should show stopCollaboration dialog', function() {
            viewModel.stopCollaboration(course);
            expect(stopCollaborationDialog.show).toHaveBeenCalledWith(course.id, course.title());
        });
    });

    describe('courseDeleted:', function() {
        var course = {
            id: '0',
            title: ko.observable('title')
        };

        beforeEach(function () {
            viewModel.courses([course]);
        });

        it('should remove learning path from collection', function () {
            viewModel.courseDeleted(course.id);
            expect(viewModel.courses().length).toBe(0);
        });
    });

    describe('courseCollaborationStartedHandler:', function () {
        var course = new CourseModel({
            id: 'testId3',
            title: 'Test Course 3',
            sections: [],
            template: template,
            createdBy: userName,
            createdOn: new Date(2013, 12, 31)
        });

        var collaboratedCourse = new CourseModel({
            id: 'testId',
            title: 'Test Course',
            sections: [],
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
            viewModel.courses([vmCourse]);
            viewModel.titleUpdated(course);

            expect(vmCourse.title()).toBe(course.title);
        });

        it('should update course modified on date', function () {
            viewModel.courses([vmCourse]);
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
            viewModel.courses([vmCourse]);
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

    describe('newCourseCreated', function () {

        it('should be function', function () {
            expect(viewModel.newCourseCreated).toBeFunction();
        });

        describe('when course is duplicate', function() {

            it('should not add course to list and remove isDuplicate property', function() {
                var course = { id: 'id', title: 'title', template: { thumbnail: 'thumbnail' } };
                course.isDuplicate = true;
                viewModel.newCourseCreated(course);
                expect(course.isDuplicate).not.toBeDefined();
                expect(viewModel.courses().find(function(item) { return item.id === course.id })).not.toBeDefined();
            });

        });

        describe('when course is not duplicate', function() {

            it('should add course to the list of courses', function() {
                var course = { id: 'id', title: 'title', template: { thumbnail: 'thumbnail' } };
                viewModel.newCourseCreated(course);
                expect(viewModel.courses()[0].id).toBe(course.id);
                expect(viewModel.courses()[0].title()).toBe(course.title);
            });

        });

    });

});
