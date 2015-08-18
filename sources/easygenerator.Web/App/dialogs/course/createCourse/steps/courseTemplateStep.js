﻿define(['durandal/events', 'dialogs/course/common/templateSelector/templateSelector', 'constants'],
    function (events, templateSelector, constants) {
        "use strict";
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