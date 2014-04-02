﻿define(['viewmodels/courses/deliver'],
    function (viewModel) {
        "use strict";

        var
            router = require('plugins/router'),
            constants = require('constants'),
            userContext = require('userContext'),
            notify = require('notify'),
            app = require('durandal/app'),
            repository = require('repositories/courseRepository'),
            eventTracker = require('eventTracker'),
            localizationManager = require('localization/localizationManager'),
            clientContext = require('clientContext'),
            backButton = require('controls/backButton/backButton');

        describe('viewModel [deliver]', function () {
            var course = {
                id: 'testCourseId',
                title: 'title',
            };

            beforeEach(function () {
                spyOn(notify, 'error');
                spyOn(eventTracker, 'publish');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('courseId:', function () {
                it('should be defined', function () {
                    expect(viewModel.courseId).toBeDefined();
                });
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

                it('should be equal to allowed deliver states', function () {
                    expect(viewModel.states).toEqual(constants.deliveringStates);
                });

            });

            describe('buildAction:', function () {
                it('should be observable', function () {
                    expect(viewModel.buildAction).toBeObservable();
                });
            });

            describe('scormBuildAction:', function () {
                it('should be observable', function () {
                    expect(viewModel.scormBuildAction).toBeObservable();
                });
            });

            describe('publishAction:', function () {
                it('should be observable', function () {
                    expect(viewModel.publishAction).toBeObservable();
                });
            });

            describe('publishToAim4YouAction:', function () {

                it('should be observable', function () {
                    expect(viewModel.publishToAim4YouAction).toBeObservable();
                });

            });

            describe('isDeliveringProcessInProgress:', function () {

                it('should be computed', function () {
                    expect(viewModel.isDeliveringInProgress).toBeComputed();
                });

                describe('when all actions are not delivering', function () {
                    it('should return false', function () {
                        viewModel.buildAction({ isDelivering: ko.observable(false) });
                        viewModel.scormBuildAction({ isDelivering: ko.observable(false) });
                        viewModel.publishAction({ isDelivering: ko.observable(false) });
                        viewModel.publishToAim4YouAction({ isDelivering: ko.observable(false) });
                        expect(viewModel.isDeliveringInProgress()).toBeFalsy();
                    });
                });

                describe('when build action is defined and is delivering', function () {
                    it('should return true', function () {
                        viewModel.buildAction({ isDelivering: ko.observable(true) });
                        viewModel.scormBuildAction({ isDelivering: ko.observable(false) });
                        viewModel.publishAction({ isDelivering: ko.observable(false) });
                        viewModel.publishToAim4YouAction({ isDelivering: ko.observable(false) });
                        expect(viewModel.isDeliveringInProgress()).toBe(true);
                    });
                });

                describe('when scorm build action is defined and is delivering', function () {
                    it('should return true', function () {
                        viewModel.buildAction({ isDelivering: ko.observable(false) });
                        viewModel.scormBuildAction({ isDelivering: ko.observable(true) });
                        viewModel.publishAction({ isDelivering: ko.observable(false) });
                        viewModel.publishToAim4YouAction({ isDelivering: ko.observable(false) });
                        expect(viewModel.isDeliveringInProgress()).toBe(true);
                    });
                });

                describe('when publish action is defined and is delivering', function () {
                    it('should return true', function () {
                        viewModel.buildAction({ isDelivering: ko.observable(false) });
                        viewModel.scormBuildAction({ isDelivering: ko.observable(false) });
                        viewModel.publishAction({ isDelivering: ko.observable(true) });
                        viewModel.publishToAim4YouAction({ isDelivering: ko.observable(false) });
                        expect(viewModel.isDeliveringInProgress()).toBe(true);
                    });
                });

                describe('when publish to Aim4You action is defined and is delivering', function () {
                    it('should return true', function () {
                        viewModel.buildAction({ isDelivering: ko.observable(false) });
                        viewModel.scormBuildAction({ isDelivering: ko.observable(false) });
                        viewModel.publishAction({ isDelivering: ko.observable(false) });
                        viewModel.publishToAim4YouAction({ isDelivering: ko.observable(true) });
                        expect(viewModel.isDeliveringInProgress()).toBe(true);
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
                    spyOn(backButton, 'enable');
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

                it('should enable back button', function () {
                    viewModel.activate('SomeId');
                    expect(backButton.enable).toHaveBeenCalledWith('text text', 'courses', viewModel.navigateToCoursesEvent);
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
                                viewModel.scormBuildAction({ isDelivering: ko.observable(false) });

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

            describe('when current course build failed', function () {

                var message = "message";

                describe('and when message is defined', function () {
                    it('should show notification', function () {
                        viewModel.courseId = 'id';
                        app.trigger(constants.messages.course.build.failed, viewModel.courseId, message);
                        expect(notify.error).toHaveBeenCalledWith(message);
                    });
                });

                describe('and when message is not defined', function () {
                    it('should not show notification', function () {
                        viewModel.courseId = 'id';
                        app.trigger(constants.messages.course.build.failed, viewModel.courseId);
                        expect(notify.error).not.toHaveBeenCalled();
                    });
                });

            });

            describe('when any other course build failed', function () {

                it('should not show notification', function () {
                    viewModel.courseId = 'id';
                    app.trigger(constants.messages.course.build.failed, '100500');
                    expect(notify.error).not.toHaveBeenCalled();
                });

            });

            describe('when current course publish failed', function () {

                var message = "message";

                describe('and when message is defined', function () {
                    it('should show notification', function () {
                        viewModel.courseId = 'id';
                        app.trigger(constants.messages.course.publish.failed, viewModel.courseId, message);
                        expect(notify.error).toHaveBeenCalledWith(message);
                    });
                });

                describe('and when message is not defined', function () {
                    it('should not show notification', function () {
                        viewModel.courseId = 'id';
                        app.trigger(constants.messages.course.publish.failed, viewModel.courseId);
                        expect(notify.error).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when any other course build failed', function () {

                it('should not show notification', function () {
                    viewModel.courseId = 'id';
                    app.trigger(constants.messages.course.publish.failed, '100500');
                    expect(notify.error).not.toHaveBeenCalled();
                });

            });

            describe('when current course scorm build failed', function () {

                var message = "message";

                describe('and when message is defined', function () {
                    it('should show notification', function () {
                        viewModel.courseId = 'id';
                        app.trigger(constants.messages.course.scormBuild.failed, viewModel.courseId, message);
                        expect(notify.error).toHaveBeenCalledWith(message);
                    });
                });

                describe('and when message is not defined', function () {
                    it('should not show notification', function () {
                        viewModel.courseId = 'id';
                        app.trigger(constants.messages.course.scormBuild.failed, viewModel.courseId);
                        expect(notify.error).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when any other course scorm build failed', function () {

                it('should not show notification', function () {
                    viewModel.courseId = 'id';
                    app.trigger(constants.messages.course.scormBuild.failed, '100500');
                    expect(notify.error).not.toHaveBeenCalled();
                });

            });
        });

    }
);
