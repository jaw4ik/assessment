define(['eventTracker', 'plugins/dialog', 'constants', 'plugins/router', 'repositories/collaboratorRepository', 'localization/localizationManager'],
    function (eventTracker, dialog, constants, router, repository, localizationManager) {
        "use strict";

        var events = {
            addPersonForCollaboration: 'Add person for collaboration'
        };

        var ctor = function () {
            var viewModel = this;
            viewModel.email = ko.observable('');
            viewModel.errorMessage = ko.observable('');
            viewModel.email.subscribe(function () {
                viewModel.errorMessage('');
            });
            viewModel.isEditing = ko.observable(false);
            viewModel.email.isValid = ko.computed(function () {
                return constants.patterns.email.test(viewModel.email().trim());
            });
            viewModel.email.isEmpty = ko.computed(function () {
                return _.isEmptyOrWhitespace(viewModel.email());
            });
            viewModel.email.isModified = ko.observable(false);
            viewModel.email.markAsModified = function () {
                viewModel.email.isModified(true);
            };

            viewModel.validate = function () {
                if (viewModel.email.isEmpty()) {
                    viewModel.errorMessage(localizationManager.localize('fillInUserEmail'));
                    return false;
                }

                if (!viewModel.email.isValid()) {
                    viewModel.errorMessage(localizationManager.localize('enterValidEmail'));
                    return false;
                }

                return true;
            };

            viewModel.hasError = ko.computed(function () {
                return !!(viewModel.errorMessage() && viewModel.errorMessage().length);
            });

            viewModel.submit = function () {
                eventTracker.publish(events.addPersonForCollaboration);
                if (!viewModel.validate()) {
                    return;
                }

                return repository.add(router.routeData().courseId, this.email().trim())
                    .then(function () {
                        dialog.close(viewModel);
                    })
                    .fail(function (errorMessage) {
                        viewModel.errorMessage(errorMessage);
                    });
            }
        }

        return ctor;
    });