define(['viewmodels/courses/course/design/templateBrief'], function (TemplateBrief) {
    "use strict";

    var template = {
        id: 'id',
        name: 'name',
        thumbnail: 'thumb',
        previewImages: [{}],
        previewDemoUrl: 'url',
        shortDescription: 'description',
        order: 0,
        settingsUrls: {
            design: 'design.html'
        }
    },
		viewModel;

    describe('course design [templateBrief]', function () {

        beforeEach(function () {
            viewModel = new TemplateBrief(template);
        });

        describe('id:', function () {
            it('should be set', function () {
                expect(viewModel.id).toBe(template.id);
            });
        });

        describe('name:', function () {
            it('should be set', function () {
                expect(viewModel.name).toBe(template.name);
            });
        });

        describe('thumbnail:', function () {
            it('should be set', function () {
                expect(viewModel.thumbnail).toBe(template.thumbnail);
            });
        });

        describe('description:', function () {
            it('should be set', function () {
                expect(viewModel.description).toBe(template.shortDescription);
            });
        });

        describe('previewImages:', function () {
            it('should be set', function () {
                expect(viewModel.previewImages).toBe(template.previewImages);
            });
        });

        describe('designSettingsUrl:', function () {
            it('should be set', function () {
                expect(viewModel.designSettingsUrl).toBe(template.settingsUrls.design);
            });
        });

        describe('settingsAvailable:', function () {
            describe('when design settings url is null', function () {
                it('should be true', function () {
                    template.settingsUrls.design = null;
                    viewModel = new TemplateBrief(template);
                    expect(viewModel.settingsAvailable).toBeFalsy();
                });
            });

            describe('when design settings url is not null', function () {
                it('should be true', function () {
                    template.settingsUrls.design = 'url';
                    viewModel = new TemplateBrief(template);
                    expect(viewModel.settingsAvailable).toBeTruthy();
                });
            });
        });

        describe('previewDemoUrl:', function () {
            it('should be set', function () {
                expect(viewModel.previewDemoUrl).toBe(template.previewDemoUrl);
            });
        });

        describe('isLoading:', function () {
            it('should be observable', function () {
                expect(viewModel.isLoading).toBeObservable();
            });
        });
    });

});
