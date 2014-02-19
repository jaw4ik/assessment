define(['viewmodels/courses/design'], function (viewModel) {
    "use strict";

    var router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        courseRepository = require('repositories/courseRepository'),
        templateRepository = require('repositories/templateRepository'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager'),
        clientContext = require('clientContext');

    describe('viewModel [design]', function () {

        var
            getCourseDefer,
            updateCourseTemplateDefer,
            getTemplateCollectionDefer;

        beforeEach(function () {
            getCourseDefer = Q.defer();
            getTemplateCollectionDefer = Q.defer();
            updateCourseTemplateDefer = Q.defer();

            spyOn(courseRepository, 'getById').andReturn(getCourseDefer.promise);
            spyOn(courseRepository, 'updateCourseTemplate').andReturn(updateCourseTemplateDefer.promise);
            spyOn(templateRepository, 'getCollection').andReturn(getTemplateCollectionDefer.promise);

            spyOn(router, 'replace');
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'saved');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('goBackTooltip:', function () {
            it('should be defined', function () {
                expect(viewModel.goBackTooltip).toBeDefined();
            });
        });

        describe('navigateToCourses:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToCourses).toBeFunction();
            });

            it('should send event \'Navigate to courses\'', function () {
                viewModel.navigateToCourses();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
            });

            it('should navigate to #courses', function () {
                spyOn(router, "navigate");
                viewModel.navigateToCourses();
                expect(router.navigate).toHaveBeenCalledWith('courses');
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

            it('should set goBackTooltip', function () {
                spyOn(localizationManager, 'localize').andReturn('text');
                viewModel.activate('SomeId');
                expect(viewModel.goBackTooltip).toEqual('text text');
            });

            describe('when course was not found', function () {

                beforeEach(function () {
                    getCourseDefer.reject('reason');
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

                var
                    templates = [
                        { id: "0", name: "Default", image: "path/to/image1.png", description: "Default template", previewDemoUrl: 'preview_url_default' },
                        { id: "1", name: "Quiz", image: "path/to/image2.png", description: "Quiz template", previewDemoUrl: 'preview_url_quiz' }
                    ],
                    template = templates[0],
                    course = { id: 'courseId', template: template };

                beforeEach(function () {
                    getCourseDefer.resolve(course);
                });

                it('should get collection of templates from repository', function () {
                    var promise = viewModel.activate(course.id);
                    getTemplateCollectionDefer.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(templateRepository.getCollection).toHaveBeenCalled();
                    });
                });

                it('should set course id as the last visited in client context', function () {
                    spyOn(clientContext, 'set');
                    var promise = viewModel.activate(course.id);
                    getTemplateCollectionDefer.reject();

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
                    getTemplateCollectionDefer.reject();
                    
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', null);
                    });
                });

                describe('and an error occured when getting templates', function () {
                    beforeEach(function () {
                        getTemplateCollectionDefer.reject('reason');
                    });

                    it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                        router.activeItem.settings.lifecycleData = null;

                        var promise = viewModel.activate(course.id);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        });
                    });

                    it('should reject promise', function () {
                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('reason');
                        });
                    });

                });

                describe('and got templates', function () {

                    beforeEach(function () {
                        getTemplateCollectionDefer.resolve(templates);

                        function toBeTemplate(actual, value) {
                            var valueJson = JSON.stringify(value);
                            var actualJson = JSON.stringify(actual);
                            this.message = function () {
                                return "Expected template to be " + valueJson + ", but it is " + actualJson;
                            };

                            return actualJson == valueJson;
                        }

                        this.addMatchers({
                            toBeTemplate: function (value) {
                                return toBeTemplate.apply(this, [this.actual, value]);
                            }
                        });
                    });

                    it('should set a list of available templates', function () {
                        var promise = viewModel.activate(course.id);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.templates[0]).toBeTemplate(templates[0]);
                            expect(viewModel.templates[1]).toBeTemplate(templates[1]);
                        });
                    });

                    describe('should map templates:', function () {

                        beforeEach(function () {
                            var promise = viewModel.activate();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                template = viewModel.templates[0];
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

                        describe('image:', function () {

                            it('should be defined', function () {
                                expect(template.image).toBeDefined();
                            });

                        });

                        describe('openPreview:', function () {

                            it('should be function', function () {
                                expect(template.openPreview).toBeFunction();
                            });

                            var event = {
                                stopPropagation: function () { }
                            };

                            beforeEach(function() {
                                spyOn(event, 'stopPropagation');
                                spyOn(router, 'openUrl').andCallFake(function() { });
                            });

                            it('should stop propagation', function () {
                                template.openPreview(template, event);
                                expect(event.stopPropagation).toHaveBeenCalled();
                            });

                            it('should open template preview in new tab', function () {
                                template.openPreview(template, event);
                                expect(router.openUrl).toHaveBeenCalledWith(template.previewDemoUrl);
                            });

                        });

                    });

                    it('should set currentTemplate', function () {
                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.currentTemplate()).toBeTemplate(template);
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

                    var promise,
                        modifiedOn;

                    beforeEach(function () {
                        promise = updateCourseTemplateDefer.promise.finally(function () { });
                        modifiedOn = new Date();

                        updateCourseTemplateDefer.resolve({ modifiedOn: modifiedOn });
                    });

                    it('should show update notification', function () {
                        viewModel.currentTemplate({ id: '' });

                        viewModel.selectTemplate({ id: 'templateId' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.saved).toHaveBeenCalled();
                        });
                    });

                    it('should change current template', function () {
                        var template = { id: 'templateId' };
                        viewModel.currentTemplate({ id: '' });

                        viewModel.selectTemplate(template);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.currentTemplate()).toBe(template);
                        });
                    });

                    it('should hide progress bar', function () {
                        var template = { id: 'templateId' };
                        viewModel.currentTemplate({ id: '' });
                        viewModel.showProgress(true);

                        viewModel.selectTemplate(template);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.showProgress()).toBeFalsy();
                        });
                    });

                });

                describe('and template was not changed', function () {

                    var promise;

                    beforeEach(function () {
                        promise = updateCourseTemplateDefer.promise.finally(function () { });
                        updateCourseTemplateDefer.reject();
                    });

                    it('should hide progress bar', function () {
                        var template = { id: 'templateId' };
                        viewModel.currentTemplate({ id: '' });
                        viewModel.showProgress(true);

                        viewModel.selectTemplate(template);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.showProgress()).toBeFalsy();
                        });
                    });

                });

            });

        });

        describe('showProgress', function () {

            it('should be observable', function () {
                expect(viewModel.showProgress).toBeObservable();
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

    });

});
