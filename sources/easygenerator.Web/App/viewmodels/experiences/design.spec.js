define(['viewmodels/experiences/design'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            experienceRepository = require('repositories/experienceRepository'),
            templateRepository = require('repositories/templateRepository'),
            notify = require('notify'),
            localizationManager = require('localization/localizationManager');

        describe('viewModel [design]', function () {

            var
                selectedTemplate = {
                    id: 'SomeTemplateId',
                    name: 'SomeTemplateName',
                    image: 'SomeTemplateImage'
                },
                experience = {
                    id: 'SomeExperienceId',
                    template: selectedTemplate
                },

                templates = [selectedTemplate, {
                    id: 'SomeTemplateId2',
                    name: 'SomeTemplateName2',
                    image: 'SomeTemplateImage2',
                    description: 'SomeDescription2'
                }];

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

            describe('activate:', function () {

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    var result = viewModel.activate(experience.id);
                    expect(result).toBePromise();
                });

                it('should get experience from repository', function () {
                    var promise = viewModel.activate(experience.id).fin(function () { });
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
                        var promise = viewModel.activate(experience.id).fin(function () { });
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

                    it('should set selectedTemplateId', function () {
                        var promise = viewModel.activate(experience.id).fin(function () { });
                        getTemplateCollectionDefer.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.selectedTemplateId()).toEqual(selectedTemplate.id);
                        });
                    });

                    it('should set selectedTemlateImage', function () {
                        var promise = viewModel.activate(experience.id).fin(function () { });
                        getTemplateCollectionDefer.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.selectedTemlateImage()).toEqual(selectedTemplate.image);
                        });
                    });
                    
                    it('should set selectedTemlateDescription', function () {
                        var promise = viewModel.activate(experience.id).fin(function () { });
                        getTemplateCollectionDefer.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.selectedTemlateDescription()).toEqual(selectedTemplate.description);
                        });
                    });

                    it('should get templates from repository', function () {
                        var promise = viewModel.activate(experience.id).fin(function () { });
                        getTemplateCollectionDefer.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(templateRepository.getCollection).toHaveBeenCalled();
                        });
                    });

                    describe('and experience has selected template', function () {

                    });

                    describe('and templates not found in repository', function () {

                        it('should navigate to 404', function () {
                            var promise = viewModel.activate(experience.id).fin(function () { });
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

                        it('should update templates in viewModel', function () {
                            var promise = viewModel.activate(experience.id).fin(function () { });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.templates).toEqual(templates);
                            });
                        });

                    });

                });
            });

            describe('updateExperienceTemplate:', function () {

                beforeEach(function () {
                    viewModel.experienceId = experience.id;
                    viewModel.selectedTemplateId(selectedTemplate.id);
                });

                it('should be function', function () {
                    expect(viewModel.updateExperienceTemplate).toBeFunction();
                });

                it('should send event \'Change experience template to \'selectedTemplate.name\'\'', function () {
                    viewModel.updateExperienceTemplate();

                    var selectedTemplate = _.find(viewModel.templates, function (item) {
                        return item.id === viewModel.selectedTemplateId();
                    });

                    expect(eventTracker.publish).toHaveBeenCalledWith('Change experience template to' + ' \'' + selectedTemplate.name + '\'');
                });

                it('should call updateExperienceTemplate in repository', function () {
                    viewModel.updateExperienceTemplate();

                    var promise = updateExperienceTemplateDefer.promise.fin(function () { });

                    updateExperienceTemplateDefer.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(experienceRepository.updateExperienceTemplate).toHaveBeenCalledWith(viewModel.experienceId, viewModel.selectedTemplateId());
                    });
                });

                describe('when template successfuly updated', function () {

                    var promise,
                        modifiedOn;

                    beforeEach(function () {
                        promise = updateExperienceTemplateDefer.promise.fin(function () { });
                        modifiedOn = new Date();

                        updateExperienceTemplateDefer.resolve({ modifiedOn: modifiedOn });
                    });

                    it('should show update notification', function () {
                        viewModel.updateExperienceTemplate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalledWith(localizationManager.localize('savedAt') + ' ' + modifiedOn.toLocaleTimeString());
                        });
                    });

                    it('should show update selectedTemlateImage', function () {
                        viewModel.selectedTemlateImage('SomePreviousImage');
                        viewModel.updateExperienceTemplate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.selectedTemlateImage()).toEqual(selectedTemplate.image);
                        });
                    });

                    it('should show update selectedTemlateImage', function () {
                        viewModel.selectedTemlateDescription('SomePreviousDescription');
                        viewModel.updateExperienceTemplate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.selectedTemlateDescription()).toEqual(selectedTemplate.description);
                        });
                    });

                });

            });

            describe('selectedTemplateId:', function () {

                it('should be observable', function() {
                    expect(viewModel.selectedTemplateId).toBeObservable();
                });

            });
            
            describe('selectedTemlateImage:', function () {

                it('should be observable', function () {
                    expect(viewModel.selectedTemlateImage).toBeObservable();
                });

            });
            
            describe('selectedTemlateDescription:', function () {

                it('should be observable', function () {
                    expect(viewModel.selectedTemlateDescription).toBeObservable();
                });

            });

        });

    });
