define(['viewmodels/courses/design'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        courseRepository = require('repositories/courseRepository'),
        templateRepository = require('repositories/templateRepository'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager'),
        clientContext = require('clientContext'),
        ping = require('ping'),
        constants = require('constants'),
        BackButton = require('models/backButton')
    ;

    describe('viewModel [design]', function () {

        var
            getCourseDefer,
            updateCourseTemplateDefer,
            getTemplateCollectionDefer;

        beforeEach(function () {
            getCourseDefer = Q.defer();
            getTemplateCollectionDefer = Q.defer();
            updateCourseTemplateDefer = Q.defer();

            spyOn(courseRepository, 'getById').and.returnValue(getCourseDefer.promise);
            spyOn(courseRepository, 'updateCourseTemplate').and.returnValue(updateCourseTemplateDefer.promise);
            spyOn(templateRepository, 'getCollection').and.returnValue(getTemplateCollectionDefer.promise);

            spyOn(router, 'replace');
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'saved');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
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

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should get course from repository', function () {
                var courseId = 'courseId';
                viewModel.activate(courseId);
                expect(courseRepository.getById).toHaveBeenCalledWith(courseId);
            });

            describe('when course was not found', function () {

                beforeEach(function () {
                    getCourseDefer.reject('reason');
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

                var
                    templates = [
                        { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', order: 1 },
                        { id: "1", name: "Quiz", thumbnail: "path/to/image2.png", previewImages: ["path/to/previewImg.png"], description: "Quiz template", previewDemoUrl: 'preview_url_quiz', order: 0 }
                    ],
                    template = templates[1],
                    course = { id: 'courseId', template: template };

                beforeEach(function () {
                    spyOn(clientContext, 'set');
                    getCourseDefer.resolve(course);
                });

                it('should get collection of templates from repository', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(templateRepository.getCollection).toHaveBeenCalled();
                        done();
                    });
                });

                it('should set course id as the last visited in client context', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVistedCourse, course.id);
                        done();
                    });
                });

                it('should reset last visited objective in client context', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVisitedObjective, null);
                        done();
                    });
                });

                describe('and an error occured when getting templates', function () {

                    beforeEach(function () {
                        getTemplateCollectionDefer.reject('reason');
                    });

                    it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                        router.activeItem.settings.lifecycleData = null;

                        viewModel.activate(course.id).fin(function () {
                            expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                            done();
                        });
                    });

                    it('should reject promise', function (done) {
                        var promise = viewModel.activate(course.id);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('reason');
                            done();
                        });
                    });

                });

                describe('and got templates', function () {

                    beforeEach(function () {
                        getTemplateCollectionDefer.resolve(templates);

                        jasmine.addMatchers({
                            toBeTemplate: function () {
                                return {
                                    compare: function (actual, expected) {
                                        var expectedJson = JSON.stringify(expected);
                                        var actualJson = JSON.stringify(actual);

                                        var result = {
                                            pass: (expectedJson == actualJson)
                                        }

                                        if (result.pass) {
                                            result.message = "Ok";
                                        } else {
                                            result.message = "Expected template to be " + expectedJson + ", but it is " + actualJson;
                                        }

                                        return result;
                                    }
                                }
                            }
                        });
                    });

                    describe('should map templates:', function () {

                        beforeEach(function (done) {
                            viewModel.activate().fin(function () {
                                template = viewModel.templates[0];
                                done();
                            });
                        });

                        describe('id:', function () {

                            it('should be defined', function () {
                                expect(template.id).toBeDefined();
                            });

                        });

                        describe('name:', function () {

                            it('should be defined', function () {
                                expect(template.name).toBeDefined();
                            });

                        });

                        describe('description:', function () {

                            it('should be defined', function () {
                                expect(template.description).toBeDefined();
                            });

                        });

                        describe('thumbnail:', function () {

                            it('should be defined', function () {
                                expect(template.thumbnail).toBeDefined();
                            });

                        });

                        describe('previewImages:', function () {

                            it('should be array', function () {
                                expect(template.previewImages.length).toBeDefined();
                            });

                        });

                        describe('openPreview:', function () {

                            var event = {
                                stopPropagation: function () { }
                            };

                            beforeEach(function () {
                                spyOn(event, 'stopPropagation');
                                spyOn(router, 'openUrl').and.callFake(function () { });
                            });

                            it('should be function', function () {
                                expect(template.openPreview).toBeFunction();
                            });

                            it('should stop propagation', function () {
                                template.openPreview(template, event);
                                expect(event.stopPropagation).toHaveBeenCalled();
                            });

                            it('should open template preview in new tab', function () {
                                template.openPreview(template, event);
                                var previewUrl = router.openUrl.calls.mostRecent().args[0];
                                var url = previewUrl.substring(0, previewUrl.indexOf('?'));
                                expect(url).toBe(template.previewDemoUrl);
                            });

                        });

                    });

                    it('should set a list of available templates by order', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.templates[0]).toBeTemplate(templates[1]);
                            expect(viewModel.templates[1]).toBeTemplate(templates[0]);
                            done();
                        });
                    });

                    it('should set currentTemplate', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.currentTemplate()).toBeTemplate(template);
                            done();
                        });
                    });

                });

            });

        });

        describe('selectTemplate:', function () {

            it('should be function', function () {
                expect(viewModel.selectTemplate).toBeFunction();
            });


            describe('when template is already selected', function () {

                beforeEach(function () {
                    viewModel.courseId = 'courseId';
                });

                it('should not send event \'Change course template to \'selectedTemplateName\'\'', function () {
                    var template = { id: 'templateId' };
                    viewModel.currentTemplate(template);

                    viewModel.selectTemplate(template);

                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });

                it('should not change template from repository', function () {
                    var template = { id: 'templateId' };
                    viewModel.currentTemplate(template);

                    viewModel.selectTemplate(template);

                    expect(courseRepository.updateCourseTemplate).not.toHaveBeenCalled();
                });

            });

            describe('when template is not yet selected', function () {

                it('should send event \'Change course template to \'selectedTemplateName\'\'', function () {
                    var templateName = 'templateName';
                    viewModel.currentTemplate({ id: '' });

                    viewModel.selectTemplate({ id: 'templateId', name: 'templateName' });

                    expect(eventTracker.publish).toHaveBeenCalledWith('Change course template to \'' + templateName + '\'');
                });

                it('should change course template', function () {
                    var courseId = 'courseId';
                    var templateId = 'templateId';
                    viewModel.courseId = courseId;
                    viewModel.currentTemplate({ id: '' });

                    viewModel.selectTemplate({ id: templateId });

                    expect(courseRepository.updateCourseTemplate).toHaveBeenCalledWith(courseId, templateId);
                });

                describe('and template was changed', function () {

                    var modifiedOn;

                    beforeEach(function () {
                        modifiedOn = new Date();

                        updateCourseTemplateDefer.resolve({ modifiedOn: modifiedOn });
                    });

                    it('should show update notification', function (done) {
                        viewModel.currentTemplate({ id: '' });

                        viewModel.selectTemplate({ id: 'templateId' });

                        updateCourseTemplateDefer.promise.fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should change current template', function (done) {
                        var template = { id: 'templateId' };
                        viewModel.currentTemplate({ id: '' });

                        viewModel.selectTemplate(template);

                        updateCourseTemplateDefer.promise.fin(function () {
                            expect(viewModel.currentTemplate()).toBe(template);
                            done();
                        });
                    });

                });

            });

        });

        describe('courseId:', function () {

            it('should be defined', function () {
                expect(viewModel.courseId).toBeDefined();
            });

        });

        describe('currentTemplate:', function () {

            it('should be observable', function () {
                expect(viewModel.currentTemplate).toBeObservable();
            });

        });

        describe('templates:', function () {

            it('should be defined', function () {
                expect(viewModel.templates).toBeDefined();
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

        describe('frameLoaded:', function () {

            it('should be function', function() {
                expect(viewModel.frameLoaded).toBeFunction();
            });

            it('should show template settings', function () {
                viewModel.settingsVisibility(false);
                viewModel.frameLoaded();
                expect(viewModel.settingsVisibility()).toBeTruthy();
            });

        });

        describe('templatesListCollapsed:', function () {

            it('should be observable', function() {
                expect(viewModel.templatesListCollapsed).toBeObservable();
            });

        });

        describe('toggleTemplatesListVisibility:', function () {

            it('should be function', function() {
                expect(viewModel.toggleTemplatesListVisibility).toBeFunction();
            });

            describe('when templates list is not collapsed', function() {

                it('should collapse templates list', function () {
                    viewModel.templatesListCollapsed(false);
                    viewModel.toggleTemplatesListVisibility();
                    expect(viewModel.templatesListCollapsed()).toBeTruthy();
                });

            });

            describe('when templates list is collapsed', function () {

                it('should expand templates list', function () {
                    viewModel.templatesListCollapsed(true);
                    viewModel.toggleTemplatesListVisibility();
                    expect(viewModel.templatesListCollapsed()).toBeFalsy();
                });

            });

        });

    });

});
