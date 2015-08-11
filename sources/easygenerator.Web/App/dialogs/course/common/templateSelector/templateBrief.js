define([], function () {
    var ctor = function (template) {
        var viewModel = {
            id: template.id,
            name: template.name,
            thumbnail: template.thumbnail,
            previewImages: template.previewImages,
            description: template.shortDescription,
            order: template.order,
            loadingTemplate: ko.observable(false)
        };

        return viewModel;
    };

    return ctor;
});