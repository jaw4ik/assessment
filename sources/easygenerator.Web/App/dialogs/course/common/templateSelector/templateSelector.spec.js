define(['dialogs/course/common/templateSelector/templateSelector'], function (viewModel) {
    "use strict";

    var templateRepository = require('repositories/templateRepository'),
        router = require('plugins/router');

    var template = {
        id: 'id',
        name: 'name',
        thumbnail: 'thumb',
        previewImages: [{}],
        shortDescription: 'description',
        order: 0
    };

    describe('dialog course common templateSelector [templateSelector]', function () {
        describe('isLoading:', function () {
            it('should be observable', function () {
                expect(viewModel.isLoading).toBeObservable();
            });
        });

        describe('templates:', function () {
            it('should be observable array', function () {
                expect(viewModel.templates).toBeObservableArray();
            });
        });

        describe('selectedTemplate:', function () {
            it('should be observable', function () {
                expect(viewModel.selectedTemplate).toBeObservable();
            });
        });

        describe('activate:', function () {
            var templates = [
                    { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], shortDescription: "Default template", order: 1 },
                    { id: "1", name: "Quiz", thumbnail: "path/to/image2.png", previewImages: ["path/to/previewImg.png"], shortDescription: "Quiz template", order: 0 }
            ],
                getTemplateCollectionDefer;

            beforeEach(function () {
                getTemplateCollectionDefer = Q.defer();
                spyOn(templateRepository, 'getCollection').and.returnValue(getTemplateCollectionDefer.promise);
            });

            it('should set isLoading to true', function () {
                viewModel.activate();
                expect(viewModel.isLoading()).toBeTruthy();
            });

            it('should clear templates array', function () {
                viewModel.templates([{}]);
                viewModel.activate();
                expect(viewModel.templates().length).toBe(0);
            });

            it('should get templates from repository', function (done) {
                getTemplateCollectionDefer.reject();

                viewModel.activate().fin(function () {
                    expect(templateRepository.getCollection).toHaveBeenCalled();
                    done();
                });
            });

            describe('and when failed to get templates', function () {

                beforeEach(function () {
                    getTemplateCollectionDefer.reject('reason');
                });

                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                    router.activeItem.settings.lifecycleData = null;

                    viewModel.activate().fin(function () {
                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        done();
                    });
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.activate();

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('reason');
                        done();
                    });
                });

                it('should set is loading to false', function (done) {
                    viewModel.isLoading(true);
                    var promise = viewModel.activate();

                    promise.fin(function () {
                        expect(viewModel.isLoading()).toBeFalsy();
                        done();
                    });
                });
            });

            describe('and when templates are received', function () {

                beforeEach(function () {
                    getTemplateCollectionDefer.resolve(templates);
                });

                describe('should map templates:', function () {

                    beforeEach(function (done) {
                        viewModel.activate().fin(function () {
                            template = viewModel.templates()[0];
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
                });

                it('should set a list of available templates by order', function (done) {
                    viewModel.activate().fin(function () {
                        expect(viewModel.templates()[0].id).toBe(templates[1].id);
                        expect(viewModel.templates()[1].id).toBe(templates[0].id);
                        done();
                    });
                });

                describe('when selected template id is defined', function () {
                    it('should select specified template', function (done) {
                        var templateId = templates[0].id;
                        viewModel.activate(templateId).fin(function () {
                            expect(viewModel.selectedTemplate().id).toBe(templateId);
                            done();
                        });
                    });
                });

                describe('when selected template id is not defined', function () {
                    it('should select first template in the ordered list', function (done) {
                        viewModel.activate().fin(function () {
                            expect(viewModel.selectedTemplate().id).toBe(viewModel.templates()[0].id);
                            done();
                        });
                    });
                });

                it('should set is loading to false', function (done) {
                    viewModel.isLoading(true);
                    var promise = viewModel.activate();

                    promise.fin(function () {
                        expect(viewModel.isLoading()).toBeFalsy();
                        done();
                    });
                });
            });
        });

        describe('getSelectedTemplateId:', function () {
            describe('when selected template is not set', function () {
                beforeEach(function () {
                    viewModel.selectedTemplate(undefined);
                });

                it('should return null', function () {
                    expect(viewModel.getSelectedTemplateId()).toBeNull();
                });
            });

            describe('when selected template is set', function () {
                beforeEach(function () {
                    viewModel.selectedTemplate(template);
                });

                it('should return selected template id', function () {
                    expect(viewModel.getSelectedTemplateId()).toBe(template.id);
                });
            });
        });

        describe('selectTemplate:', function () {
            describe('when there is selected template set', function () {
                describe('and selected template id equals template to select id', function () {
                    it('should not change selected template', function () {
                        var selectedTemplate = { id: template.id };
                        viewModel.selectedTemplate(selectedTemplate);
                        viewModel.selectTemplate(template);
                        expect(viewModel.selectedTemplate()).toBe(selectedTemplate);
                    });
                });

                describe('and selected template id is not equal template to select id', function () {
                    beforeEach(function () {
                        viewModel.selectedTemplate({ id: 'idd' });
                    });

                    it('should set selected template', function () {
                        viewModel.selectTemplate(template);
                        expect(viewModel.selectedTemplate()).toBe(template);
                    });
                });
            });

            describe('when there is no selected template', function () {
                beforeEach(function () {
                    viewModel.selectedTemplate(null);
                });

                it('should set selected template', function () {
                    viewModel.selectTemplate(template);
                    expect(viewModel.selectedTemplate()).toBe(template);
                });
            });
        });
    });

});
