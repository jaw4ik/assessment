define(['viewmodels/courses/deliver'],
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

            beforeEach(function() {
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

                it('should be observable', function() {
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
                    spyOn(repository, 'getById').andReturn(getById.promise);
                    spyOn(userContext, 'identify').andReturn(identify.promise);
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
                    spyOn(backButton, 'enable');
                    spyOn(localizationManager, 'localize').and.returnValue('text');
                    viewModel.activate('SomeId');
                    expect(backButton.enable).toHaveBeenCalledWith('text text', 'courses', viewModel.navigateToCoursesEvent);
                });
                
                describe('when user is re-identified', function () {

                    beforeEach(function () {
                        identify.resolve();
                    });

                    it('should get course from repository', function () {
                        var id = 'courseId';
                        var promise = identify.promise.fin(function () { });

                        viewModel.activate(id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.getById).toHaveBeenCalledWith(id);
                        });
                    });

                    describe('when course does not exist', function () {

                        beforeEach(function () {
                            getById.reject('reason');
                        });

                        it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                            router.activeItem.settings.lifecycleData = null;

                            var promise = viewModel.activate('courseId');
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                            });
                        });

                        it('should reject promise', function () {
                            var promise = viewModel.activate('courseId');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('reason');
                            });
                        });
                    });

                    describe('when course exists', function () {

                        beforeEach(function () {
                            getById.resolve(course);
                        });

                        it('should define publish action', function () {
                            viewModel.id = undefined;

                            var promise = viewModel.activate(course.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.publishAction()).toBeDefined();
                            });
                        });

                        it('should define build action', function () {
                            viewModel.id = undefined;

                            var promise = viewModel.activate(course.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.buildAction()).toBeDefined();
                            });
                        });

                        it('should set courseId', function() {
                            viewModel.courseId = '';
                            var promise = viewModel.activate(course.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.courseId).toBe(course.id);
                            });
                        });

                        it('should set course id as the last visited in client context', function () {
                            spyOn(clientContext, 'set');
                            var promise = viewModel.activate(course.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(clientContext.set).toHaveBeenCalledWith('lastVistedCourse', course.id);
                            });
                        });

                        it('should reset last visited objective in client context', function () {
                            spyOn(clientContext, 'set');
                            var promise = viewModel.activate(course.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', null);
                            });
                        });

                        describe('and user has starter access', function () {

                            beforeEach(function () {
                                spyOn(userContext, 'hasStarterAccess').andReturn(true);
                            });

                            it('should define scorm build action', function () {
                                viewModel.scormBuildAction(undefined);

                                var promise = viewModel.activate(course.id);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.scormBuildAction()).toBeDefined();
                                });
                            });

                        });

                        describe('and user does not have starter access', function () {

                            beforeEach(function () {
                                spyOn(userContext, 'hasStarterAccess').andReturn(false);
                            });

                            it('should not define scorm build action', function () {
                                viewModel.scormBuildAction({ isDelivering: ko.observable(false) });

                                var promise = viewModel.activate(course.id);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.scormBuildAction()).not.toBeDefined();
                                });
                            });

                        });

                        it('should resolve promise', function () {
                            var promise = viewModel.activate(course.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
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
