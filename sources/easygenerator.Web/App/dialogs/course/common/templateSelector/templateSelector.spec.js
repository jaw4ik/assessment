import TemplateSelector from 'dialogs/course/common/templateSelector/templateSelector'; 

import ko from 'knockout';
import _ from 'underscore';
import router from 'routing/router';
import templateRepository from 'repositories/templateRepository';
import TemplateBrief from 'dialogs/course/common/templateSelector/templateBrief';

let viewModel = new TemplateSelector(),
    template = {
        id: 'id',
        name: 'name',
        thumbnail: 'thumb',
        previewImages: [{}],
        shortDescription: 'description',
        order: 0
    };

describe('dialog course common templateSelector [templateSelector]', () => {
    describe('isLoading:', () => {
        it('should be observable', () => {
            expect(viewModel.isLoading).toBeObservable();
        });
    });

    describe('templates:', () => {
        it('should be observable array', () => {
            expect(viewModel.templates).toBeObservableArray();
        });
    });

    describe('advancedTemplates:', () => {
        it('should be computed observable', () => {
            expect(viewModel.advancedTemplates).toBeComputed();
        });

        it('should return templates array with isAdvanced set to true', () => {
            viewModel.templates([{ isAdvanced: true }, { isAdvanced: false }]);
            expect(viewModel.advancedTemplates().length).toBe(1);
        });
    });

    describe('selectedTemplate:', () => {
        it('should be observable', () => {
            expect(viewModel.selectedTemplate).toBeObservable();
        });
    });

    describe('activate:', () => {
        var templates = [
                { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], shortDescription: "Default template", order: 1, isCustom: false },
                { id: "1", name: "Quiz", thumbnail: "path/to/image2.png", previewImages: ["path/to/previewImg.png"], shortDescription: "Quiz template", order: 0 , isCustom: false},
                { id: "2", name: "Persona", thumbnail: "path/to/image2.png", previewImages: ["path/to/previewImg.png"], shortDescription: "Persona template", order: 2 , isCustom: false}
        ],
            promise;

        beforeEach(() => {
            promise = Promise.resolve(templates);
            spyOn(templateRepository, 'getCollection').and.returnValue(promise);
        });

        it('should set isLoading to true', () => {
            viewModel.activate();
            expect(viewModel.isLoading()).toBeTruthy();
        });

        it('should clear templates array', () => {
            viewModel.templates([{}]);
            viewModel.activate();
            expect(viewModel.templates().length).toBe(0);
        });

        it('should get templates from repository', () => {
            viewModel.activate();
            expect(templateRepository.getCollection).toHaveBeenCalled();
        });

        describe('and when templates are received', () => {

            it('should map templates', done => (async () => {
                viewModel.activate();
                await promise;
                var template = viewModel.templates()[0];
                expect(template.id).toBeDefined();
                expect(template.name).toBeDefined();
                expect(template.description).toBeDefined();
                expect(template.thumbnail).toBeDefined();
                expect(template.previewImages).toBeArray();

            })().then(done));

            it('should map templates', done => (async () => {
                viewModel.activate();
                await promise;
                expect(viewModel.templates()[0].id).toBe(templates[1].id);
                expect(viewModel.templates()[1].id).toBe(templates[0].id);

            })().then(done));

            describe('when selected template id is defined', () => {
                it('when selected specified template', done => (async () => {
                    viewModel.activate();
                    await promise;
                    expect(viewModel.selectedTemplate().id).toBe(viewModel.templates()[0].id);

                })().then(done));
            });

            describe('when selected template id is not defined', () => {
                it('should select first template in the ordered list', done => (async () => {
                    viewModel.activate();
                    await promise;
                    expect(viewModel.selectedTemplate().id).toBe(viewModel.templates()[0].id);
                })().then(done));
            });

            it('should mark all system templates as advanced exept first two', done => (async () => {
                viewModel.activate();
                await promise;
                expect(viewModel.templates()[2].isAdvanced).toBeTruthy();
            })().then(done));

            it('should set is loading to false', done => (async () => {
                viewModel.isLoading(true);
                viewModel.activate();
                await promise;
                expect(viewModel.isLoading()).toBeFalsy();
            })().then(done));

            describe('when selected template is advanced', () => {
                it('should set showAdvancedTemplates to true', done => (async () => {
                    viewModel.showAdvancedTemplates(false);
                    viewModel.activate(templates[2].id);
                    await promise;
                    expect(viewModel.showAdvancedTemplates()).toBeTruthy();
                })().then(done));
            });

            describe('when selected template is not advanced', () => {
                it('should set showAdvancedTemplates to false', done => (async () => {
                    viewModel.showAdvancedTemplates(true);
                    viewModel.activate();
                    await promise;
                    expect(viewModel.showAdvancedTemplates()).toBeFalsy();
                })().then(done));
            });
        });
    });

    describe('getSelectedTemplateId:', () => {
        describe('when selected template is not set', () => {
            beforeEach(() => {
                viewModel.selectedTemplate(undefined);
            });

            it('should return null', () => {
                expect(viewModel.getSelectedTemplateId()).toBeNull();
            });
        });

        describe('when selected template is set', () => {
            beforeEach(() => {
                viewModel.selectedTemplate(template);
            });

            it('should return selected template id', () => {
                expect(viewModel.getSelectedTemplateId()).toBe(template.id);
            });
        });
    });

    describe('selectTemplate:', () => {
        describe('when there is selected template set', () => {
            describe('and selected template id equals template to select id', () => {
                it('should not change selected template', () => {
                    var selectedTemplate = { id: template.id };
                    viewModel.selectedTemplate(selectedTemplate);
                    viewModel.selectTemplate(template);
                    expect(viewModel.selectedTemplate()).toBe(selectedTemplate);
                });
            });

            describe('and selected template id is not equal template to select id', () => {
                beforeEach(() => {
                    viewModel.selectedTemplate({ id: 'idd' });
                });

                it('should set selected template', () => {
                    viewModel.selectTemplate(template);
                    expect(viewModel.selectedTemplate()).toBe(template);
                });
            });
        });

        describe('when there is no selected template', () => {
            beforeEach(() => {
                viewModel.selectedTemplate(null);
            });

            it('should set selected template', () => {
                viewModel.selectTemplate(template);
                expect(viewModel.selectedTemplate()).toBe(template);
            });
        });
    });
});

