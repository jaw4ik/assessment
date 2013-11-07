define(['viewmodels/experiences/design'], function (viewModel) {
    "use strict";

    var router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        experienceRepository = require('repositories/experienceRepository'),
        templateRepository = require('repositories/templateRepository'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager');

    describe('viewModel [design]', function () {

        var selectedTemplate = {
            id: 'selectedId',
            name: 'selectedTemplateName',
            image: 'SomeTemplateImage',
            isSelected: ko.observable(false)
        },
            templates = [selectedTemplate, {
                id: 'someId',
                name: 'someName',
                image: 'SomeTemplateImage2',
                isSelected: ko.observable(true)
            }],
            experience = {
                id: 'SomeExperienceId',
                template: selectedTemplate
            };

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
                var promise = viewModel.activate(experience.id).finally(function () { });
                getExperienceDefer.reject();
                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(experienceRepository.getById).toHaveBeenCalledWith(experience.id);
                });
            });

            describe('when experience not found', function () {

                it('should navigate to 404', function () {
                    var promise = viewModel.activate(experience.id).finally(function () { });
                    getExperienceDefer.reject();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });
                });

            });

            describe('when experience received', function () {

                beforeEach(function () {
                    getExperienceDefer.resolve(experience);
                });

                it('should get collection of templates from repository', function () {
                    var promise = viewModel.activate(experience.id).finally(function () { });
                    getTemplateCollectionDefer.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(templateRepository.getCollection).toHaveBeenCalled();
                    });
                });

                describe('and failed load templates', function () {

                    it('should navigate to 404', function () {
                        var promise = viewModel.activate(experience.id).finally(function () { });
                        getTemplateCollectionDefer.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.replace).toHaveBeenCalledWith('404');
                        });
                    });

                });

                describe('and templates received', function () {

                    beforeEach(function () {
                        getTemplateCollectionDefer.resolve(templates);
                    });

                    it('should set viewModel templates', function () {
                        var promise = viewModel.activate(experience.id).finally(function () { });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.templates[0].id).toBe(templates[0].id);
                        });
                    });

                });

            });

        });

        describe('templates:', function () {

            it('should be defined', function () {
                expect(viewModel.templates).toBeDefined();
            });

        });

        describe('switchTemplate:', function () {

            it('should be function', function () {
                expect(viewModel.switchTemplate).toBeFunction();
            });

            describe('when current template is not selected', function () {

                beforeEach(function () {
                    viewModel.experienceId = experience.id;
                });

                it('should send event \'Change experience template to \'selectedTemplateName\'\'', function () {
                    viewModel.switchTemplate(selectedTemplate);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change experience template to \'selectedTemplateName\'');
                });

                it('should update experience template from repository', function () {
                    viewModel.switchTemplate(selectedTemplate);
                    var promise = updateExperienceTemplateDefer.promise.finally(function () { });
                    updateExperienceTemplateDefer.reject();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(experienceRepository.updateExperienceTemplate).toHaveBeenCalledWith(viewModel.experienceId, selectedTemplate.id);
                    });
                });

                describe('and template updated', function () {

                    var promise,
                        modifiedOn;

                    beforeEach(function () {
                        promise = updateExperienceTemplateDefer.promise.finally(function () { });
                        modifiedOn = new Date();

                        updateExperienceTemplateDefer.resolve({ modifiedOn: modifiedOn });
                    });

                    it('should show update notification', function () {
                        viewModel.switchTemplate(selectedTemplate);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalledWith(localizationManager.localize('savedAt') + ' ' + modifiedOn.toLocaleTimeString());
                        });
                    });

                    it('should update template property isSelected to true', function () {
                        viewModel.switchTemplate(selectedTemplate);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(_.find(viewModel.templates, function (item) {
                                return item.id == selectedTemplate.id;
                            }).isSelected()).toBeTruthy();
                        });
                    });

                    it('should set property isSelected in other templates to false', function() {
                        
                        viewModel.switchTemplate(selectedTemplate);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            _.each(_.filter(viewModel.templates, function(item) {
                                return item.id !== selectedTemplate.id;
                            }), function (item) {
                                expect(item.isSelected()).toBeFalsy();
                            });
                        });

                    });

                    it('should hide progress bar', function () {
                        viewModel.isSwitchTemplateProgressShow(true);
                        viewModel.switchTemplate(selectedTemplate);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isSwitchTemplateProgressShow()).toBeFalsy();
                        });
                    });

                });

                describe('and template not updated', function() {

                    var promise;

                    beforeEach(function () {
                        promise = updateExperienceTemplateDefer.promise.finally(function () { });
                        updateExperienceTemplateDefer.reject();
                    });

                    it('should hide progress bar', function () {
                        viewModel.isSwitchTemplateProgressShow(true);
                        viewModel.switchTemplate(selectedTemplate);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isSwitchTemplateProgressShow()).toBeFalsy();
                        });
                    });

                });

            });
            
            describe('when current template is selected', function () {

                beforeEach(function () {
                    viewModel.experienceId = experience.id;
                });

                it('should not send event \'Change experience template to \'selectedTemplateName\'\'', function () {
                    viewModel.switchTemplate(templates[1]);
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Change experience template to \'selectedTemplateName\'');
                });

                it('should not switch experience template from repository', function () {
                    viewModel.switchTemplate(templates[1]);
                    var promise = updateExperienceTemplateDefer.promise.finally(function () { });
                    updateExperienceTemplateDefer.reject();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(experienceRepository.updateExperienceTemplate).not.toHaveBeenCalledWith(viewModel.experienceId, selectedTemplate.id);
                    });
                });

            });

        });

        describe('isSwitchTemplateProgressShow', function () {

            it('should be observable', function () {
                expect(viewModel.isSwitchTemplateProgressShow).toBeObservable();
            });

        });

        describe('experienceId:', function () {

            it('should be defined', function () {
                expect(viewModel.experienceId).toBeDefined();
            });

        });

    });
    
});
