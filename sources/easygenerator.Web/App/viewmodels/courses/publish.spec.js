define(['viewmodels/courses/publish'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        constants = require('constants'),
        userContext = require('userContext'),
        repository = require('repositories/courseRepository'),
        eventTracker = require('eventTracker'),
        localizationManager = require('localization/localizationManager'),
        clientContext = require('clientContext'),
        ping = require('ping'),
        BackButton = require('models/backButton'),
        Course = require('models/course');

    describe('viewModel [publish]', function () {
        var course = new Course({
            id: 'testCourseId',
            title: 'title'
        });

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
        });

        describe('navigateToCoursesEvent:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToCoursesEvent).toBeFunction();
            });

            it('should send event \'Navigate to courses\'', function () {
                viewModel.navigateToCoursesEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
            });

        });

        describe('states:', function () {

            it('should be equal to allowed publish states', function () {
                expect(viewModel.states).toEqual(constants.publishingStates);
            });

        });

        describe('buildAction:', function () {
            it('should be observable', function () {
                expect(viewModel.buildAction).toBeObservable();
            });
        });

        describe('buildActionClick:', function () {
            beforeEach(function () {
                viewModel.buildAction({ isPublishing: ko.observable(true), downloadCourse: function () { } });
                spyOn(viewModel.buildAction(), 'downloadCourse');
            });

            it('should be function', function () {
                expect(viewModel.buildActionClick).toBeFunction();
            });

            describe('when isPublishingProcessInProgress is false', function () {
                beforeEach(function () {
                    spyOn(viewModel, 'isPublishingInProgress').and.returnValue(false);
                });

                it('should call buildAction().downloadCourse()', function () {
                    viewModel.buildActionClick();
                    expect(viewModel.buildAction().downloadCourse).toHaveBeenCalled();
                });
            });
            describe('when isPublishingProcessInProgress is true', function () {
                beforeEach(function () {
                    spyOn(viewModel, 'isPublishingInProgress').and.returnValue(true);
                });

                it('should not call buildAction().downloadCourse()', function () {
                    viewModel.buildActionClick();
                    expect(viewModel.buildAction().downloadCourse).not.toHaveBeenCalled();
                });
            });
        });

        describe('scormBuildAction:', function () {
            it('should be observable', function () {
                expect(viewModel.scormBuildAction).toBeObservable();
            });
        });

        describe('scormBuildActionClick:', function () {
            beforeEach(function () {
                viewModel.scormBuildAction({ isPublishing: ko.observable(true), downloadCourse: function () { } });
                spyOn(viewModel.scormBuildAction(), 'downloadCourse');
            });

            it('should be function', function () {
                expect(viewModel.scormBuildActionClick).toBeFunction();
            });

            describe('when isPublishingProcessInProgress is false', function () {
                beforeEach(function () {
                    spyOn(viewModel, 'isPublishingInProgress').and.returnValue(false);
                });

                it('should call scormBuildAction().downloadCourse()', function () {
                    viewModel.scormBuildActionClick();
                    expect(viewModel.scormBuildAction().downloadCourse).toHaveBeenCalled();
                });
            });
            describe('when isPublishingProcessInProgress is true', function () {
                beforeEach(function () {
                    spyOn(viewModel, 'isPublishingInProgress').and.returnValue(true);
                });

                it('should not call scormBuildAction().downloadCourse()', function () {
                    viewModel.scormBuildActionClick();
                    expect(viewModel.scormBuildAction().downloadCourse).not.toHaveBeenCalled();
                });
            });
        });
        
        describe('publishAction:', function () {
            it('should be observable', function () {
                expect(viewModel.publishAction).toBeObservable();
            });
        });

        describe('publishActionClick:', function () {
            beforeEach(function () {
                viewModel.publishAction({ isPublishing: ko.observable(true), publishCourse: function () { } });
                spyOn(viewModel.publishAction(), 'publishCourse');
            });

            it('should be function', function () {
                expect(viewModel.publishActionClick).toBeFunction();
            });

            describe('when isPublishingProcessInProgress is false', function () {
                beforeEach(function () {
                    spyOn(viewModel, 'isPublishingInProgress').and.returnValue(false);
                });

                it('should call publishAction().publishCourse()', function () {
                    viewModel.publishActionClick();
                    expect(viewModel.publishAction().publishCourse).toHaveBeenCalled();
                });
            });
            describe('when isPublishingProcessInProgress is true', function () {
                beforeEach(function () {
                    spyOn(viewModel, 'isPublishingInProgress').and.returnValue(true);
                });

                it('should not call publishAction().publishCourse()', function () {
                    viewModel.publishActionClick();
                    expect(viewModel.publishAction().publishCourse).not.toHaveBeenCalled();
                });
            });
        });

        describe('publishToAim4YouActionClick:', function () {
            beforeEach(function () {
                viewModel.publishToAim4YouAction({ isPublishing: ko.observable(true), publishToAim4You: function () { } });
                spyOn(viewModel.publishToAim4YouAction(), 'publishToAim4You');
            });

            it('should be function', function () {
                expect(viewModel.publishToAim4YouActionClick).toBeFunction();
            });

            describe('when isPublishingProcessInProgress is false', function () {
                beforeEach(function () {
                    spyOn(viewModel, 'isPublishingInProgress').and.returnValue(false);
                });

                it('should call publishAction().publishToAim4You()', function () {
                    viewModel.publishToAim4YouActionClick();
                    expect(viewModel.publishToAim4YouAction().publishToAim4You).toHaveBeenCalled();
                });
            });
            describe('when isPublishingProcessInProgress is true', function () {
                beforeEach(function () {
                    spyOn(viewModel, 'isPublishingInProgress').and.returnValue(true);
                });

                it('should not call publishAction().publishToAim4You()', function () {
                    viewModel.publishToAim4YouActionClick();
                    expect(viewModel.publishToAim4YouAction().publishToAim4You).not.toHaveBeenCalled();
                });
            });
        });

        describe('publishToAim4YouAction:', function () {

            it('should be observable', function () {
                expect(viewModel.publishToAim4YouAction).toBeObservable();
            });

        });

        describe('isPublishingProcessInProgress:', function () {

            it('should be computed', function () {
                expect(viewModel.isPublishingInProgress).toBeComputed();
            });

            describe('when all actions are not publishing', function () {
                it('should return false', function () {
                    viewModel.buildAction({ isPublishing: ko.observable(false) });
                    viewModel.scormBuildAction({ isPublishing: ko.observable(false) });
                    viewModel.publishAction({ isPublishing: ko.observable(false) });
                    viewModel.publishToAim4YouAction({ isPublishing: ko.observable(false) });
                    expect(viewModel.isPublishingInProgress()).toBeFalsy();
                });
            });

            describe('when build action is defined and is publishing', function () {
                it('should return true', function () {
                    viewModel.buildAction({ isPublishing: ko.observable(true) });
                    viewModel.scormBuildAction({ isPublishing: ko.observable(false) });
                    viewModel.publishAction({ isPublishing: ko.observable(false) });
                    viewModel.publishToAim4YouAction({ isPublishing: ko.observable(false) });
                    expect(viewModel.isPublishingInProgress()).toBe(true);
                });
            });

            describe('when scorm build action is defined and is publishing', function () {
                it('should return true', function () {
                    viewModel.buildAction({ isPublishing: ko.observable(false) });
                    viewModel.scormBuildAction({ isPublishing: ko.observable(true) });
                    viewModel.publishAction({ isPublishing: ko.observable(false) });
                    viewModel.publishToAim4YouAction({ isPublishing: ko.observable(false) });
                    expect(viewModel.isPublishingInProgress()).toBe(true);
                });
            });

            describe('when publish action is defined and is publishing', function () {
                it('should return true', function () {
                    viewModel.buildAction({ isPublishing: ko.observable(false) });
                    viewModel.scormBuildAction({ isPublishing: ko.observable(false) });
                    viewModel.publishAction({ isPublishing: ko.observable(true) });
                    viewModel.publishToAim4YouAction({ isPublishing: ko.observable(false) });
                    expect(viewModel.isPublishingInProgress()).toBe(true);
                });
            });

            describe('when publish to Aim4You action is defined and is publishing', function () {
                it('should return true', function () {
                    viewModel.buildAction({ isPublishing: ko.observable(false) });
                    viewModel.scormBuildAction({ isPublishing: ko.observable(false) });
                    viewModel.publishAction({ isPublishing: ko.observable(false) });
                    viewModel.publishToAim4YouAction({ isPublishing: ko.observable(true) });
                    expect(viewModel.isPublishingInProgress()).toBe(true);
                });
            });
        });

        describe('canActivate:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(ping, 'execute').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.canActivate()).toBePromise();
            });

            it('should ping', function () {
                viewModel.canActivate();
                expect(ping.execute).toHaveBeenCalled();
            });

            describe('when ping failed', function () {

                beforeEach(function () {
                    dfd.reject();
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.canActivate();
                    promise.fin(function () {
                        expect(promise).toBeRejected();
                        done();
                    });
                });

            });

            describe('when ping succeed', function () {

                beforeEach(function () {
                    dfd.resolve();
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.canActivate();
                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

            });

        });

        describe('activate:', function () {

            var getById;
            var identify;

            beforeEach(function () {
                getById = Q.defer();
                identify = Q.defer();
                spyOn(repository, 'getById').and.returnValue(getById.promise);
                spyOn(userContext, 'identify').and.returnValue(identify.promise);
                spyOn(localizationManager, 'localize').and.returnValue('text');
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should re-identify user', function () {
                viewModel.activate();
                expect(userContext.identify).toHaveBeenCalled();
            });

            describe('when user is re-identified', function () {

                beforeEach(function () {
                    identify.resolve();
                });

                it('should get course from repository', function (done) {
                    var id = 'courseId';

                    viewModel.activate(id);

                    identify.promise.fin(function () {
                        expect(repository.getById).toHaveBeenCalledWith(id);
                        done();
                    });
                });

                describe('when course does not exist', function () {

                    beforeEach(function () {
                        getById.reject('reason');
                    });

                    it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                        router.activeItem.settings.lifecycleData = null;

                        viewModel.activate('courseId').fin(function () {
                            expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                            done();
                        });
                    });

                    it('should reject promise', function (done) {
                        var promise = viewModel.activate('courseId');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('reason');
                            done();
                        });
                    });
                });

                describe('when course exists', function () {

                    beforeEach(function () {
                        getById.resolve(course);
                        spyOn(clientContext, 'set');
                    });

                    it('should define publish action', function (done) {
                        viewModel.id = undefined;

                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.publishAction()).toBeDefined();
                            done();
                        });
                    });

                    it('should define build action', function (done) {
                        viewModel.id = undefined;

                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.buildAction()).toBeDefined();
                            done();
                        });
                    });

                    it('should set courseId', function (done) {
                        viewModel.courseId = '';
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.courseId).toBe(course.id);
                            done();
                        });
                    });

                    it('should set course id as the last visited in client context', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(clientContext.set).toHaveBeenCalledWith('lastVistedCourse', course.id);
                            done();
                        });
                    });

                    it('should reset last visited objective in client context', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', null);
                            done();
                        });
                    });

                    describe('and user has starter access', function () {

                        beforeEach(function () {
                            spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                        });

                        it('should define scorm build action', function (done) {
                            viewModel.scormBuildAction(undefined);

                            viewModel.activate(course.id).fin(function () {
                                expect(viewModel.scormBuildAction()).toBeDefined();
                                done();
                            });
                        });

                    });

                    describe('and user does not have starter access', function () {

                        beforeEach(function () {
                            spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                        });

                        it('should not define scorm build action', function (done) {
                            viewModel.scormBuildAction({ isPublishing: ko.observable(false) });

                            viewModel.activate(course.id).fin(function () {
                                expect(viewModel.scormBuildAction()).not.toBeDefined();
                                done();
                            });
                        });

                    });

                    it('should resolve promise', function (done) {
                        var promise = viewModel.activate(course.id);

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            done();
                        });
                    });

                });

            });

        });

        describe('backButtonData:', function () {

            it('should be instance of BackButton', function () {
                expect(viewModel.backButtonData).toBeInstanceOf(BackButton);
            });

            it('should be configured', function () {
                expect(viewModel.backButtonData.url).toBe('courses');
                expect(viewModel.backButtonData.backViewName).toBe(localizationManager.localize('courses'));
                expect(viewModel.backButtonData.callback).toBe(viewModel.navigateToCoursesEvent);
            });

        });

    });

});
