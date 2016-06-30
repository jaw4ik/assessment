define(['eventTracker', 'plugins/dialog', 'constants', 'routing/router', 'repositories/collaboratorRepository', 'localization/localizationManager', 'durandal/app'],
    function (eventTracker, dialog, constants, router, repository, localizationManager, app) {
        "use strict";

        var events = {
            addPersonForCollaboration: 'Add person for collaboration'
        };

        var viewModel = {
            email: ko.observable(''),
            errorMessage: ko.observable(''),
            isEditing: ko.observable(false),
            actionInProgress: ko.observable(false),
            collaborationWarning: ko.observable(''),
            isEnabled: ko.observable(true),

            submit: submit,
            reset: reset
        };

        viewModel.email.subscribe(function () {
            viewModel.errorMessage('');
        });

        viewModel.email.isModified = ko.observable(false),

        viewModel.email.isValid = ko.computed(function () {
            return constants.patterns.email.test(viewModel.email().trim());
        });

        viewModel.email.isEmpty = ko.computed(function () {
            return _.isEmptyOrWhitespace(viewModel.email());
        });

        viewModel.email.markAsModified = function () {
            viewModel.email.isModified(true);
        };

        viewModel.hasError = ko.computed(function () {
            return !!(viewModel.errorMessage() && viewModel.errorMessage().length);
        });

        return viewModel;

        function reset() {
            viewModel.email.isModified(false);
            viewModel.email('');
            viewModel.isEditing(false);
            viewModel.actionInProgress(false);
            viewModel.errorMessage('');
        }

        function submit() {
            if (!validate()) {
                return;
            }

            viewModel.actionInProgress(true);
            eventTracker.publish(events.addPersonForCollaboration);
            var courseId = router.routeData().courseId;
            return repository.add(courseId, this.email().trim().toLowerCase())
                .then(function (collaborator) {
                    if (_.isNullOrUndefined(collaborator)) {
                        viewModel.errorMessage(localizationManager.localize('cannotAddDuplicateCoauthor'));
                    }
                    else {
                        app.trigger(constants.messages.course.collaboration.collaboratorAdded + courseId, collaborator);

                        viewModel.email.isModified(false);
                        viewModel.email('');
                    }
                })
                .fail(function (errorMessage) {
                    viewModel.errorMessage(errorMessage);
                })
                .fin(function () {
                    viewModel.actionInProgress(false);
                    viewModel.isEditing(true);
                });
        }

        function validate() {
            if (viewModel.email.isEmpty()) {
                viewModel.errorMessage(localizationManager.localize('fillInUserEmail'));
                return false;
            }

            if (!viewModel.email.isValid()) {
                viewModel.errorMessage(localizationManager.localize('enterValidEmail'));
                return false;
            }

            return true;
        }
    }
);