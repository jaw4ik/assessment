﻿define(['durandal/events', 'constants', 'clientContext', 'localization/localizationManager'],
    function (events, constants, clientContext, localizationManager) {
        "use strict";
        var viewModel = {
            title: ko.observable(''),
            maxLength: constants.validation.courseTitleMaxLength,
            isEditing: ko.observable(),
            isChanged: ko.observable(),
            isProcessing: ko.observable(false),
            beginEdit: beginEdit,
            endEdit: endEdit,
            submit: submit,
            activate: activate,
            deactivate: deactivate,
            titleChanged: titleChanged,
            caption: ''
        };

        viewModel.isValid = ko.computed(function () {
            var length = viewModel.title() ? viewModel.title().trim().length : 0;
            return length > 0 && length <= viewModel.maxLength;
        });

        events.includeIn(viewModel);
        return viewModel;

        function activate() {
            viewModel.caption = _.isNullOrUndefined(clientContext.get(constants.clientContextKeys.showCreateCoursePopup)) ?
                'Create your course' : 'Create your first course';

            viewModel.title('');
            viewModel.isChanged(false);
            viewModel.isProcessing(false);
            viewModel.titleSubscription = viewModel.title.subscribe(titleChanged);
        }

        function deactivate() {
            if (viewModel.titleSubscription) {
                viewModel.titleSubscription.dispose();
            }
        }

        function submit() {
            if (!viewModel.isValid()) {
                viewModel.isChanged(true);
                return;
            }

            viewModel.title(viewModel.title() && viewModel.title().trim());
            viewModel.trigger(constants.dialogs.stepSubmitted);
        }

        function beginEdit() {
            viewModel.isEditing(true);
        }

        function endEdit() {
            viewModel.isEditing(false);
        }

        function titleChanged() {
            viewModel.isChanged(true);
        }
    });