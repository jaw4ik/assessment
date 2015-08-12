define(['plugins/router', 'dialogs/course/common/templateSelector/templateBrief', 'repositories/templateRepository'], function (router, TemplateBrief, templateRepository) {
    var viewModel = {
        isLoading: ko.observable(false),
        templates: ko.observableArray([]),
        selectedTemplate: ko.observable(),
        activate: activate,
        getSelectedTemplateId: getSelectedTemplateId,
        selectTemplate: selectTemplate
    };

    return viewModel;

    function activate(selectedTemplateId) {
        viewModel.templates.removeAll();
        console.log('Activate template selector');

        viewModel.isLoading(true);
        return templateRepository.getCollection().then(function (templates) {
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
    }

    function selectTemplate(template) {
        if (template.id === getSelectedTemplateId()) {
            return;
        }

        selectTemplateById(template.id);
    }

    function selectTemplateById(id) {
        if (id) {
            viewModel.selectedTemplate(_.find(viewModel.templates(), function (item) { return item.id === id; }));
        } else {
            viewModel.selectedTemplate(viewModel.templates()[0]);
        }
    }

    function getSelectedTemplateId() {
        return viewModel.selectedTemplate() ? viewModel.selectedTemplate().id : null;
    }
});