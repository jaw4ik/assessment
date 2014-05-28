define(['eventTracker', 'plugins/dialog', 'constants', 'plugins/router', 'repositories/collaboratorRepository', 'localization/localizationManager', 'durandal/app'],
    function (eventTracker, dialog, constants, router, repository, localizationManager, app) {
        "use strict";

        var events = {
            addPersonForCollaboration: 'Add person for collaboration'
        };

        var viewModel = {
            email: ko.observable(''),
            errorMessage: ko.observable(''),
            isShown: ko.observable(false),
            isEditing: ko.observable(false),
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
            viewModel.errorMessage('');

            viewModel.isShown(true);
        }

        function hide() {
            viewModel.isShown(false);
        }

        function submit() {
            eventTracker.publish(events.addPersonForCollaboration);
            if (!validate()) {
                return;
            }

            return repository.add(router.routeData().courseId, this.email().trim())
                .then(function (collaborator) {
                    if (!_.isNullOrUndefined(collaborator)) {
                        app.trigger(constants.messages.course.collaboration.collaboratorAdded, router.routeData().courseId, collaborator);
                    }

                    viewModel.hide();
                })
                .fail(function (errorMessage) {
                    viewModel.errorMessage(errorMessage);
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
    });