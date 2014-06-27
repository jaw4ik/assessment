define(['localization/localizationManager', 'durandal/app', 'constants', 'dialogs/collaboration/removeCollaborator', 'notify'],
    function (localizationManager, app, constants, removeCollaboratorDialogCtor, notify) {

        var ctor = function (courseOwner, collaborator) {
            var viewModel = {
                email: collaborator.email,
                displayName: ko.observable(''),
                isOwner: collaborator.email == courseOwner,
                registered: ko.observable(collaborator.registered),
                createdOn: collaborator.createdOn,
                collaboratorRegistered: collaboratorRegistered,
                deletingStarted: deletingStarted,
                deletingFailed: deletingFailed,
                deletingCompleted: deletingCompleted,
                deactivate: deactivate
            }

            viewModel.name = _.isNullOrUndefined(collaborator.fullName) || _.isEmptyOrWhitespace(collaborator.fullName) ? collaborator.email : collaborator.fullName;
            viewModel.displayName(getDisplayName(collaborator, viewModel.isOwner));
            viewModel.avatarLetter = ko.computed(function () {
               
                return viewModel.registered() ? viewModel.displayName().charAt(0) : '?';
            });

            viewModel.showRemoveConfirmation = ko.observable(false);
            viewModel.changeShowRemoveConfirmation = function () {
                viewModel.removeCollaboratorDialog.show();
                viewModel.showRemoveConfirmation(true);
            }

            viewModel.removeCollaboratorDialog = new removeCollaboratorDialogCtor(collaborator.id, viewModel.avatarLetter(), viewModel.name);

            if (!viewModel.registered()) {
                app.on(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
            }

            viewModel.isRemoving = ko.observable(collaborator.state === constants.collaboratorStates.deleting);

            if (!viewModel.isOwner) {
                app.on(constants.messages.course.collaboration.deleting.started + collaborator.id, viewModel.deletingStarted);
                app.on(constants.messages.course.collaboration.deleting.failed + collaborator.id, viewModel.deletingFailed);
                app.on(constants.messages.course.collaboration.deleting.completed + collaborator.id, viewModel.deletingCompleted);
            }

            function deletingStarted() {
                viewModel.isRemoving(true);
                viewModel.showRemoveConfirmation(false);
            };

            function deletingFailed(message) {
                viewModel.isRemoving(false);
                notify.error(localizationManager.localize('collaboratorRemovingFailed'));
            };

            function deletingCompleted() {
                viewModel.isRemoving(false);
                notify.success('<p class="user-name">' + viewModel.name + '</p>' + localizationManager.localize('collaboratorWasRemoved'));
            };

            return viewModel;

            function getDisplayName(user, isOwner) {
                if (isOwner) {
                    return viewModel.name + ': ' + localizationManager.localize('owner');
                }

                return user.registered ? viewModel.name : viewModel.name + ':\n' + localizationManager.localize('waitingForRegistration');
            }

            function deactivate() {
                app.off(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
                app.off(constants.messages.course.collaboration.deleting.started + collaborator.id, viewModel.deletingStarted);
                app.off(constants.messages.course.collaboration.deleting.failed + collaborator.id, viewModel.deletingFailed);
                app.off(constants.messages.course.collaboration.deleting.completed + collaborator.id, viewModel.deletingCompleted);
            }

            function collaboratorRegistered(userInfo) {
                viewModel.displayName(userInfo.fullName);
                viewModel.registered(true);

                app.off(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
            }
        };

        return ctor;
    });
