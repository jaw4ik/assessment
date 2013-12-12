define(['viewmodels/experiences/design'], function (viewModel) {
    "use strict";

    var router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        experienceRepository = require('repositories/experienceRepository'),
        templateRepository = require('repositories/templateRepository'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager');

    describe('viewModel [design]', function () {

        var
            getExperienceDefer,
            updateExperienceTemplateDefer,
            getTemplateCollectionDefer;

        beforeEach(function () {
            getExperienceDefer = Q.defer();
            getTemplateCollectionDefer = Q.defer();
            updateExperienceTemplateDefer = Q.defer();

            spyOn(experienceRepository, 'getById').andReturn(getExperienceDefer.promise);
            spyOn(experienceRepository, 'updateExperienceTemplate').andReturn(updateExperienceTemplateDefer.promise);
            spyOn(templateRepository, 'getCollection').andReturn(getTemplateCollectionDefer.promise);

            spyOn(router, 'replace');
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'info');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should get experience from repository', function () {
                var experienceId = 'experienceId';
                viewModel.activate(experienceId);
                expect(experienceRepository.getById).toHaveBeenCalledWith(experienceId);
            });

            describe('when experience was not found', function () {

                beforeEach(function () {
                    getExperienceDefer.reject('reason');
                });

                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                    router.activeItem.settings.lifecycleData = null;

                    var promise = viewModel.activate('experienceId');
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                    });
                });

                it('should reject promise', function () {
                    var promise = viewModel.activate('experienceId');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('reason');
                    });
                });
            });

            describe('when experience exists', function () {

                var template = { id: 'templateId', settingsUrl: 'settingsUrl' };
                var experience = { id: 'experienceId', template: template };

                beforeEach(function () {
                    getExperienceDefer.resolve(experience);
                });

                it('should get collection of templates from repository', function () {
                    var promise = viewModel.activate(experience.id);
                    getTemplateCollectionDefer.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(templateRepository.getCollection).toHaveBeenCalled();
                    });
                });

                describe('and an error occured when getting templates', function () {
                    beforeEach(function() {
                        getTemplateCollectionDefer.reject('reason');
                    });
                    
                    it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                        router.activeItem.settings.lifecycleData = null;

                        var promise = viewModel.activate(experience.id);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        });
                    });

                    it('should reject promise', function () {
                        var promise = viewModel.activate(experience.id);
                        
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('reason');
                        });
                    });

                });

                describe('and got templates', function () {

                    var templates = [{ id: '1' }, template];


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
                        var promise = viewModel.activate(experience.id);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.templates[0]).toBeTemplate(templates[0]);
                            expect(viewModel.templates[1]).toBeTemplate(templates[1]);
                        });
                    });

                    it('should set currentTemplate', function () {
                        var promise = viewModel.activate(experience.id);

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
                    viewModel.experienceId = 'experienceId';
                });

                it('should not send event \'Change experience template to \'selectedTemplateName\'\'', function () {
                    var template = { id: 'templateId' };
                    viewModel.currentTemplate(template);

                    viewModel.selectTemplate(template);

                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });

                it('should not change template from repository', function () {
                    var template = { id: 'templateId' };
                    viewModel.currentTemplate(template);

                    viewModel.selectTemplate(template);

                    expect(experienceRepository.updateExperienceTemplate).not.toHaveBeenCalled();
                });

            });

            describe('when template is not yet selected', function () {

                it('should send event \'Change experience template to \'selectedTemplateName\'\'', function () {
                    var templateName = 'templateName';
                    viewModel.currentTemplate({ id: '' });

                    viewModel.selectTemplate({ id: 'templateId', name: 'templateName' });

                    expect(eventTracker.publish).toHaveBeenCalledWith('Change experience template to \'' + templateName + '\'');
                });

                it('should change experience template', function () {
                    var experienceId = 'experienceId';
                    var templateId = 'templateId';
                    viewModel.experienceId = experienceId;
                    viewModel.currentTemplate({ id: '' });

                    viewModel.selectTemplate({ id: templateId });

                    expect(experienceRepository.updateExperienceTemplate).toHaveBeenCalledWith(experienceId, templateId);
                });

                describe('and template was changed', function () {

                    var promise,
                        modifiedOn;

                    beforeEach(function () {
                        promise = updateExperienceTemplateDefer.promise.finally(function () { });
                        modifiedOn = new Date();

                        updateExperienceTemplateDefer.resolve({ modifiedOn: modifiedOn });
                    });

                    it('should show update notification', function () {
                        viewModel.currentTemplate({ id: '' });

                        viewModel.selectTemplate({ id: 'templateId' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalledWith(localizationManager.localize('savedAt') + ' ' + modifiedOn.toLocaleTimeString());
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
                        promise = updateExperienceTemplateDefer.promise.finally(function () { });
                        updateExperienceTemplateDefer.reject();
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

        describe('experienceId:', function () {

            it('should be defined', function () {
                expect(viewModel.experienceId).toBeDefined();
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
