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

        describe('companyInfo:', function () {

            it('should be defined', function() {
                expect(viewModel.companyInfo).toBeDefined();
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

        describe('buildAction:', function () {
            it('should be defined', function () {
                expect(viewModel.buildAction).toBeDefined();
            });
        });

        describe('scormBuildAction:', function () {
            it('should be defined', function () {
                expect(viewModel.scormBuildAction).toBeDefined();
            });
        });

        describe('publishAction:', function () {
            it('should be defined', function () {
                expect(viewModel.publishAction).toBeDefined();
            });
        });

        describe('publishToAim4YouAction:', function () {

            it('should be defined', function () {
                expect(viewModel.publishToAim4YouAction).toBeDefined();
            });

        });

        describe('publishToCustomLms:', function () {
            it('should be defined', function () {
                expect(viewModel.publishToCustomLms).toBeDefined();
            });
        });

        describe('sendOpenLinkTab:', function () {

            it('should be function', function () {
                expect(viewModel.sendOpenLinkTab).toBeFunction();
            });

            it('should send event \'Open link tab\'', function () {
                viewModel.sendOpenLinkTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open link tab');
            });

        });

        describe('sendOpenEmbedTab:', function () {

            it('should be function', function () {
                expect(viewModel.sendOpenEmbedTab).toBeFunction();
            });

            it('should send event \'Open embed tab\'', function () {
                viewModel.sendOpenEmbedTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open embed tab');
            });

        });

        describe('sendOpenScormTab:', function () {

            it('should be function', function () {
                expect(viewModel.sendOpenScormTab).toBeFunction();
            });

            it('should send event \'Open \'download SCORM\'\'', function () {
                viewModel.sendOpenScormTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open \'download SCORM\'');
            });

        });

        describe('sendOpenHtmlTab:', function () {

            it('should be function', function () {
                expect(viewModel.sendOpenHtmlTab).toBeFunction();
            });

            it('should send event \'Open \'downoload HTML\'\'', function () {
                viewModel.sendOpenHtmlTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open \'downoload HTML\'');
            });

        });

        describe('sendOpenAim4YouTab:', function () {

            it('should be function', function () {
                expect(viewModel.sendOpenAim4YouTab).toBeFunction();
            });

            it('should send event \'Open \'Publish to Aim4You\'\'', function () {
                viewModel.sendOpenAim4YouTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open \'Publish to Aim4You\'');
            });

        });

        describe('sendOpenCustomPublishTab:', function () {
            
            it('should be function', function () {
                expect(viewModel.sendOpenCustomPublishTab).toBeFunction();
            });

            it('should send event \'Open custom publish tab\'', function () {
                viewModel.sendOpenCustomPublishTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open custom publish tab');
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
                userContext.identity = {
                    company: { name: 'companyName' }
                };
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

                it('should set companyInfo', function (done) {
                    viewModel.companyInfo = null;
                    getById.resolve();

                    viewModel.activate().fin(function () {
                        expect(viewModel.companyInfo).toBe(userContext.identity.company);
                        done();
                    });
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

                    it('should set courseId', function (done) {
                        viewModel.courseId = '';
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.courseId).toBe(course.id);
                            done();
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

    });

});

