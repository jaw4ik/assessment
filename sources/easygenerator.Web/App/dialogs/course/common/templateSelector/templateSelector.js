define(['plugins/router', 'dialogs/course/common/templateSelector/templateBrief', 'repositories/templateRepository'], function (router, TemplateBrief, templateRepository) {
    var viewModel = {
        isLoading: ko.observable(false),
        templates: ko.observable([]),
        selectedTemplate: ko.observable(),
        activate: activate
    };

    return viewModel;

    function activate(selectedTemplateId) {
        if (viewModel.templates().length === 0) {
            viewModel.isLoading(true);
            templateRepository.getCollection().then(function (templates) {
                viewModel.templates(_.chain(templates)
                    .map(function (template) {
                        return new TemplateBrief(template);
                    })
                    .sortBy(function (template) { return template.order; })
                    .value());
                selectTemplateById(selectedTemplateId);
            }).then(function () {
                viewModel.isLoading(false);
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        } else {
            selectTemplateById(selectedTemplateId);
        }
    }

    function selectTemplateById(id) {
        if (id) {
            viewModel.selectedTemplate(_.find(viewModel.templates(), function (item) { return item.id == id; }));
        }
    }
});