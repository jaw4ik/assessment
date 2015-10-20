define([], function () {
    var ctor = function (template) {
        var viewModel = {
            id: template.id,
            name: template.name,
            thumbnail: template.thumbnail,
            previewImages: template.previewImages,
            description: template.shortDescription,
            designSettingsUrl: template.settingsUrls.design,
            settingsAvailable: template.settingsUrls.design != null,
            previewDemoUrl: template.previewDemoUrl,
            isLoading: ko.observable(false)
        };

        return viewModel;
    };

    return ctor;
});
