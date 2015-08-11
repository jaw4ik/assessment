define(['durandal/events', 'dialogs/course/common/templateSelector/templateSelector', 'repositories/templateRepository', 'constants'],
    function (events, templateSelector, templateRepository, constants) {

        var viewModel = {
            submit: submit,
            activate: activate,
            selectedTemplateId: ko.observable(''),
            templateSelector: templateSelector,
            getSelectedTemplateId: getSelectedTemplateId
        };

        events.includeIn(viewModel);
        return viewModel;

        function activate(selectedTemplateId) {
            console.log('Activate template step');


            viewModel.selectedTemplateId(selectedTemplateId);
            //return templateRepository.getDefaultTemplate().then(function (defaultTemplate) {
            //    viewModel.defaultTemplateId = defaultTemplate.id;
            //});
        }

        function submit() {
            viewModel.trigger(constants.dialogs.stepSubmitted);
        }

        function getSelectedTemplateId() {
            return viewModel.templateSelector.getSelectedTemplateId();
        }
    });