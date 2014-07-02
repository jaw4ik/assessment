define(['eventTracker', 'plugins/dialog', 'constants', 'plugins/router', 'repositories/collaboratorRepository', 'localization/localizationManager', 'durandal/app', 'userContext'],
    function (eventTracker, dialog, constants, router, repository, localizationManager, app, userContext) {
        "use strict";

        var events = {
            addPersonForCollaboration: 'Add person for collaboration'
        };

        var viewModel = {
            email: ko.observable(''),
            errorMessage: ko.observable(''),
            isShown: ko.observable(false),
            isEditing: ko.observable(false),
            actionInProgress: ko.observable(false),
            collaborationWarning: ko.observable(''),

            submit: submit,
            show: show,
            hide: hide
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

        function show() {
            viewModel.email.isModified(false);
            viewModel.email('');
            viewModel.isEditing(false);
            viewModel.actionInProgress(false);
            viewModel.errorMessage('');

            viewModel.isShown(true);

            var courseId = router.routeData().courseId;
            repository.getCollection(courseId).then(function (collaborators) {
                updateCollaborationWarning(collaborators);
            });
        }

        function hide() {
            viewModel.isShown(false);
        }

        function submit() {
            if (!validate()) {
                return;
            }

            viewModel.actionInProgress(true);
            eventTracker.publish(events.addPersonForCollaboration);
            var courseId = router.routeData().courseId;
            return repository.add(courseId, this.email().trim())
                .then(function (collaborator) {
                    if (!_.isNullOrUndefined(collaborator)) {
                        app.trigger(constants.messages.course.collaboration.collaboratorAdded + courseId, collaborator);
                    }

                    viewModel.hide();
                })
                .fail(function (errorMessage) {
                    viewModel.errorMessage(errorMessage);
                })
                .fin(function () {
                    viewModel.actionInProgress(false);
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

        function updateCollaborationWarning(collaborators) {
            if (userContext.identity.subscription.accessType === constants.accessType.free) {
                viewModel.collaborationWarning(localizationManager.localize('addCollaboratorFreeWarning'));
            } else if (userContext.identity.subscription.accessType === constants.accessType.starter && collaborators.length > constants.maxStarterPlanCollaborators) {
                viewModel.collaborationWarning(localizationManager.localize('addCollaboratorStarterWarning'));
            } else {
                viewModel.collaborationWarning('');
            }
        }

    }
);