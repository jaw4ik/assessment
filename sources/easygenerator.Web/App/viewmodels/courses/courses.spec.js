import viewModel from './courses';

import ko from 'knockout';
import _ from 'underscore';
import router from 'routing/router';
import eventTracker from 'eventTracker';
import dataContext from 'dataContext';
import userContext from 'userContext';
import CourseModel from 'models/course';
import constants from 'constants';
import limitCoursesAmount from 'authorization/limitCoursesAmount';
import duplicateCourseCommand from 'commands/duplicateCourseCommand';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import waiter from 'utils/waiter';
import createCourseDialog from 'dialogs/course/createCourse/createCourse';
import deleteCourseDialog from 'dialogs/course/delete/deleteCourse';
import stopCollaborationDialog from 'dialogs/course/stopCollaboration/stopCollaboration';
import localizationManager from 'localization/localizationManager';

var templates = [
        { id: '0', name: 'First template', thumbnail: 'img' },
        { id: '1', name: 'Second template', thumbnail: 'img' },
];
var courses = [
        new CourseModel({
            id: 'testId3',
            title: 'Test Course 3',
            sections: [],
            template: templates[0],
            createdBy: 'user@user.com',
            createdByName: 'User first',
            saleInfo: {},
            ownership: 0,
            modifiedOn: new Date(2000),
            createdOn: new Date(4000)
        }),
        new CourseModel({
            id: 'testId2',
            title: 'Test Course 2',
            sections: [],
            template: templates[1],
            createdBy: 'user@user.com',
            createdByName: 'User first',
            saleInfo: {},
            ownership: 1,
            modifiedOn: new Date(1000),
            createdOn: new Date(1000)
        }),
        new CourseModel({
            id: 'testId1',
            title: 'Test Course 1',
            sections: [],
            template: templates[0],
            createdBy: 'user@user.com',
            createdByName: '',
            saleInfo: {},
            ownership: 0,
            modifiedOn: new Date(3000),
            createdOn: new Date(5000)
        }),
         new CourseModel({
             id: 'testId4',
             title: 'Test Course 4',
             sections: [],
             template: templates[1],
             createdBy: 'someone',
             createdByName: 'User second',
             saleInfo: {},
             ownership: 2,
             modifiedOn: new Date(0),
             createdOn: new Date(3000)
         }),
        new CourseModel({
            id: 'testId5',
            title: 'Test Course 5',
            sections: [],
            template: templates[1],
            createdBy: 'someone',
            createdByName: 'User second',
            saleInfo: {},
            ownership: 2,
            modifiedOn: new Date(5000),
            createdOn: new Date(4000)
        })
];

describe('viewModel [courses]', function () {

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(router, 'replace');
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
            dataContext.templates = templates;

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

        it('should create available sort list array', function(done){

            identifyUserDeferred.resolve();

            viewModel.activate().fin(function(){
                expect(viewModel.sortingOptions.recentlyModified).toBe('recentlyModified');
                done();
            });
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
                userContext.identity = { email: 'user@user.com' }
            });

            it('should set courses data from dataContext', function (done) {

                identifyUserDeferred.resolve();

                viewModel.activate().fin(function () {
                    expect(viewModel.courses().length).toEqual(5);
                    done();
                });
            });

            it('should set templates data from dataContext', function (done) {

                identifyUserDeferred.resolve();

                viewModel.activate().fin(function () {
                    expect(viewModel.availableTemplates().length).toEqual(3);
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

            it('should set availableTemplates first item', function(done) {
                identifyUserDeferred.resolve();

                viewModel.activate().fin(function () {
                    expect(viewModel.availableTemplates()[0]).toBeObject();
                    expect(viewModel.availableTemplates()[0].name).toBe(localizationManager.localize('all'));                    
                    expect(viewModel.availableTemplates()[0].count).toBeObservable();
                    expect(viewModel.availableTemplates()[0].count()).toBe(5);
                    done();
                });
            });            

            it('should set default coursesSortOrder value', function(done) {
                identifyUserDeferred.resolve();
                localStorage.removeItem('coursesSortOrder');
                                
                viewModel.activate().fin(function () {
                    expect(viewModel.coursesSortOrder()).toBe('recentlyModified');
                    done();
                });
            });

            it('should set coursesSortOrder value from localStorage', function(done) {
                identifyUserDeferred.resolve();                                
                localStorage.setItem('coursesSortOrder', 'alphanumeric');

                viewModel.activate().fin(function () {
                    expect(viewModel.coursesSortOrder()).toBe('alphanumeric');
                    done();
                });
            });

            describe('coursesTemplateFilter ', function() {
                                
                it('should be observable ', function(done) {
                    identifyUserDeferred.resolve();
                                
                    viewModel.activate().fin(function () {
                        expect(viewModel.coursesTemplateFilter).toBeObservable();
                        done(); 
                    });
                });

                
                it('should call getCoursesSubCollection after changes', function(done) {
                    identifyUserDeferred.resolve();                                
                
                    viewModel.activate().fin(function () {
                        viewModel.coursesTemplateFilter(templates[0].name);

                        expect(viewModel.ownedCourses().length).toBe(2);
                        done(); 
                    });
                }); 
            });

            describe('coursesTitleFilter ', function() {
                
                it('should be observable ', function(done) {
                    identifyUserDeferred.resolve();
                                
                    viewModel.activate().fin(function () {
                        expect(viewModel.coursesTitleFilter).toBeObservable();
                        done(); 
                    });
                });

                
                it('should filter courses by title after changes', function(done) {
                    identifyUserDeferred.resolve();

                    viewModel.activate().fin(function () {
                        viewModel.coursesTitleFilter('Test Course 4');

                        expect(viewModel.organizationCourses().length).toBe(1);
                        done(); 
                    });
                });   

                it('should filter courses by user email after changes', function(done) {
                    identifyUserDeferred.resolve();

                    viewModel.activate().fin(function () {
                        viewModel.coursesTitleFilter('someone');

                        expect(viewModel.organizationCourses().length).toBe(2);
                        done(); 
                    });
                });

                it('should filter courses by user name after changes', function(done) {
                    identifyUserDeferred.resolve();

                    viewModel.activate().fin(function () {
                        viewModel.coursesTitleFilter('User second');

                        expect(viewModel.organizationCourses().length).toBe(2);
                        done(); 
                    });
                });

                it('should not filter courses by current user email after changes', function(done) {
                    identifyUserDeferred.resolve();

                    viewModel.activate().fin(function () {
                        viewModel.coursesTitleFilter('user@user.com');

                        expect(viewModel.organizationCourses().length).toBe(0);
                        done(); 
                    });
                });

                it('should not filter courses by current user name after changes', function(done) {
                    identifyUserDeferred.resolve();

                    viewModel.activate().fin(function () {
                        viewModel.coursesTitleFilter('User first');

                        expect(viewModel.organizationCourses().length).toBe(0);
                        done(); 
                    });
                });
            });
        });
    });

    describe('courses length visible: ', function() {
        var identifyUserDeferred;

        beforeEach(function () {
            dataContext.courses = courses;
            dataContext.templates = templates;

            identifyUserDeferred = Q.defer();

            spyOn(userContext, 'identify').and.returnValue(identifyUserDeferred.promise);
        });

        it('should courses length visible be observable', function(done) {
            identifyUserDeferred.resolve();

            viewModel.activate().fin(function(){
                expect(viewModel.isCoursesListEmpty).toBeObservable();
                expect(viewModel.isCoursesListEmpty).toBeFalsy;
                done();
            });
        });        
    });

    describe('course mapper:', function() {
        var identifyUserDeferred;

        beforeEach(function () {
            dataContext.courses = courses;
            dataContext.templates = templates;

            identifyUserDeferred = Q.defer();

            spyOn(userContext, 'identify').and.returnValue(identifyUserDeferred.promise);
        });

        describe('if course createdByName is clear', function(){

            it('should set email in createdByName field', function(done) {
                identifyUserDeferred.resolve();

                viewModel.activate().fin(function(){

                    expect(viewModel.courses()[2].createdByName).toBe('user@user.com');
                    done();
                });
            });
        });        
    });

    describe('getCoursesSubCollection:', function() {

        var identifyUserDeferred;

        beforeEach(function () {
            dataContext.courses = courses;
            dataContext.templates = templates;

            identifyUserDeferred = Q.defer();

            spyOn(userContext, 'identify').and.returnValue(identifyUserDeferred.promise);
        });

        it('should set invisible to courses with another template', function(done) {
            identifyUserDeferred.resolve();

            viewModel.activate().fin(function(){
                viewModel.coursesTemplateFilter(templates[1].name);

                expect(viewModel.ownedCourses().length).toBe(0);
                done();
            });
        });

        describe('recently modified ', function(){
            it('should sort course list', function(done) {
                identifyUserDeferred.resolve();

                viewModel.activate().fin(function() {
                    viewModel.coursesSortOrder('recentlyModified');

                    expect(viewModel.ownedCourses()[0].title()).toBe(courses[2].title);
                    done();
                });
            });
        });

        describe('recently created ', function(){
            it('should sort course list', function(done) {
                identifyUserDeferred.resolve();

                viewModel.activate().fin(function() {
                    viewModel.coursesSortOrder('recentlyCreated');      

                    expect(viewModel.organizationCourses()[0].title()).toBe(courses[4].title);
                    done();
                });
            });
        });

        describe('alphanumeric ', function(){
            it('should sort course list', function(done) {
                identifyUserDeferred.resolve();

                viewModel.activate().fin(function() {
                    viewModel.coursesSortOrder('alphanumeric');

                    expect(viewModel.organizationCourses()[0].title()).toBe(courses[3].title);
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
                createdBy: 'someone',
                createdByName: 'User second',
                isSelected: ko.observable(false),
                template: 'Simple Course',
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
                    expect(viewModel.courses()[0].title()).toBe(course.title());
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
                    template: { thumbnail: '', name: 'Simple Course' },
                    modifiedOn: new Date(),
                    createdBy: 'someone',
                    createdByName: 'User second',
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
            title: ko.observable('title'),
            createdBy: 'someone',
            createdByName: 'User second',
            ownership: ko.observable(constants.courseOwnership.owned),
        };

        beforeEach(function () {
            viewModel.courses([course]);
        });

        it('should remove course from collection', function () {
            viewModel.courseDeleted(course.id);
            expect(viewModel.courses().length).toBe(0);
        });

        it('should not remove course from collection', function () {
            viewModel.courseDeleted('1');
            expect(viewModel.courses().length).toBe(1);
        });
    });

    describe('titleUpdated:', function () {
        var courseId = "courseId";
        var vmCourse = {
            id: courseId,
            title: ko.observable(""),
            createdBy: 'someone',
            createdByName: 'User second',
            modifiedOn: ko.observable(""),
            ownership: ko.observable(),
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
            title: ko.observable('abs'),
            createdBy: 'someone',
            createdByName: 'User second',
            modifiedOn: ko.observable(""),
            ownership: ko.observable(),
        };
        var course = {
            id: courseId,
            modifiedOn: new Date()
        };

        it('should update course modified on date', function () {
            viewModel.courses([vmCourse]);
            viewModel.courseUpdated(course);

            expect(vmCourse.modifiedOn().toISOString()).toBe(course.modifiedOn.toISOString());
        });

    });

    describe('courseOwnershipUpdated:', function () {
        var courseId = "courseId";
        var vmCourse = {
            id: courseId,
            modifiedOn: ko.observable(""),
            createdBy: 'someone',
            createdByName: 'User second',
            ownership: ko.observable(constants.courseOwnership.owned),
            title: ko.observable('')
        };

        it('should update course ownership', function () {
            viewModel.courses([vmCourse]);
            viewModel.courseOwnershipUpdated(courseId, constants.courseOwnership.shared);

            expect(vmCourse.ownership()).toBe(constants.courseOwnership.shared);
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
                var course = { id: 'id', createdBy: 'someone', createdByName: 'User second', title: 'title', template: { thumbnail: 'thumbnail' } };
                course.isDuplicate = true;
                viewModel.newCourseCreated(course);
                expect(course.isDuplicate).not.toBeDefined();
                expect(_.find(viewModel.courses(), function(item) { return item.id === course.id })).not.toBeDefined();
            });
        });

        describe('when course is not duplicate', function() {

            it('should add course to the list of courses', function() {
                var course = { id: 'id', title: 'title', createdBy: 'someone', createdByName: 'User second', template: { thumbnail: 'thumbnail' } };
                viewModel.newCourseCreated(course);
                expect(viewModel.courses()[0].id).toBe(course.id);
                expect(viewModel.courses()[0].title()).toBe(course.title);
            });
        });

    });

});