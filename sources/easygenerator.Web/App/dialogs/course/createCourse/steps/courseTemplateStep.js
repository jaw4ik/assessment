define(['durandal/events', 'dialogs/course/common/templateSelector/templateSelector', 'repositories/templateRepository', 'constants'],
    function (events, templateSelector, templateRepository, constants) {

        var viewModel = {
            submit: submit,
            activate: activate,
            defaultTemplateId: '',
            templateSelector: templateSelector,
            getSelectedTemplateId: getSelectedTemplateId
        };

        events.includeIn(viewModel);
        return viewModel;

        function activate() {
            return templateRepository.getDefaultTemplate().then(function (defaultTemplate) {
                viewModel.defaultTemplateId = defaultTemplate.id;
            });
        }

        function submit() {
            viewModel.trigger(constants.dialogs.stepSubmitted);
        }

        function getSelectedTemplateId() {
            return viewModel.templateSelector.getSelectedTemplateId();
        }
    });