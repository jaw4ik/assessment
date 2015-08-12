define(['durandal/events', 'dialogs/course/common/templateSelector/templateSelector', 'repositories/templateRepository', 'constants'],
    function (events, templateSelector, templateRepository, constants) {

        var viewModel = {
            submit: submit,
            templateSelector: templateSelector,
            getSelectedTemplateId: getSelectedTemplateId
        };

        events.includeIn(viewModel);
        return viewModel;

        function submit() {
            viewModel.trigger(constants.dialogs.stepSubmitted);
        }

        function getSelectedTemplateId() {
            return viewModel.templateSelector.getSelectedTemplateId();
        }
    });