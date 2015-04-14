define(['viewmodels/courses/course/publish'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        constants = require('constants'),
        userContext = require('userContext'),
        repository = require('repositories/courseRepository'),
        eventTracker = require('eventTracker'),
        localizationManager = require('localization/localizationManager'),
        clientContext = require('clientContext'),
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
                            expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVistedCourse, course.id);
                            done();
                        });
                    });

                    it('should reset last visited objective in client context', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVisitedObjective, null);
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

                    describe('when course delivering', function () {

                        it('should disabled all publish action in view', function (done) {
                            course.isDelivering = false;
                            getById.resolve(course);
                            viewModel.activate(course.id).fin(function () {
                                expect(viewModel.isCourseDelivering()).toBeFalsy();
                                done();
                            });
                        });

                    });

                    describe('when course is not delivering', function () {

                        it('should enabled all publish action in view', function (done) {
                            course.isDelivering = true;
                            getById.resolve(course);
                            viewModel.activate(course.id).fin(function () {
                                expect(viewModel.isCourseDelivering()).toBeTruthy();
                                done();
                            });
                        });

                    });

                });

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
                expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.scorm);
            });

            it('should open upgrade link in new window', function () {
                viewModel.openUpgradePlanUrl();
                expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
            });

        });

        describe('courseDeliveringStarted:', function () {
            it('should be function', function () {
                expect(viewModel.courseDeliveringStarted).toBeFunction();
            });

            describe('when course is current course', function () {
                it('should set isCourseDelivering to true', function () {
                    viewModel.isCourseDelivering(false);
                    viewModel.courseDeliveringStarted(course);
                    expect(viewModel.isCourseDelivering()).toBeTruthy();
                });
            });

            describe('when course is not current course', function () {
                it('should not change isCourseDelivering', function () {
                    viewModel.isCourseDelivering(false);
                    viewModel.courseDeliveringStarted({ id: 'none' });
                    expect(viewModel.isCourseDelivering()).toBeFalsy();
                });
            });
        });

        describe('courseDeliveringFinished:', function () {
            it('should be function', function () {
                expect(viewModel.courseDeliveringFinished).toBeFunction();
            });

            describe('when course is current course', function () {
                it('should set isCourseDelivering to false', function () {
                    viewModel.isCourseDelivering(true);
                    viewModel.courseDeliveringFinished(course);
                    expect(viewModel.isCourseDelivering()).toBeFalsy();
                });
            });

            describe('when course is not current course', function () {
                it('should not change isCourseDelivering', function () {
                    viewModel.isCourseDelivering(true);
                    viewModel.courseDeliveringFinished({ id: 'none' });
                    expect(viewModel.isCourseDelivering()).toBeTruthy();
                });
            });
        });

    });

});
