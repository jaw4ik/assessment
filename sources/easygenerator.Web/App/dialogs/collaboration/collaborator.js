define(['localization/localizationManager', 'durandal/app', 'constants', 'repositories/collaboratorRepository', 'plugins/router', 'eventTracker'],
    function (localizationManager, app, constants, collaboratorRepository, router, eventTracker) {

        var events = {
            removeCollaborator: 'Remove collaborator'
        };

        var ctor = function (courseOwner, collaborator) {
            var viewModel = {
                id: collaborator.id,
                email: collaborator.email,
                isOwner: collaborator.email == courseOwner,
                isRegistered: ko.observable(collaborator.registered),
                isAccepted: ko.observable(collaborator.isAccepted),
                name: ko.observable(_.isNullOrUndefined(collaborator.fullName) || _.isEmptyOrWhitespace(collaborator.fullName) ? collaborator.email : collaborator.fullName),
                collaboratorRegistered: collaboratorRegistered,
                collaborationAccepted: collaborationAccepted,
                removeCollaborator: removeCollaborator,
                showRemoveConfirmation: showRemoveConfirmation,
                hideRemoveConfirmation: hideRemoveConfirmation,
                deactivate: deactivate,
                isLocked: ko.observable(false),
                lock: lock,
                unlock: unlock
            }

            viewModel.avatarLetter = ko.computed(function () {
                return viewModel.isRegistered() ? viewModel.name().charAt(0) : '';
            });

            viewModel.canBeRemoved = !viewModel.isOwner,
            viewModel.isRemoving = ko.observable(collaborator.state === constants.collaboratorStates.deleting);
            viewModel.isRemoveConfirmationShown = ko.observable(viewModel.isRemoving());
            viewModel.isRemoveSuccessMessageShown = ko.observable(false);

            if (!viewModel.isRegistered()) {
                app.on(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
            }

            if (!viewModel.isAccepted()) {
                app.on(constants.messages.course.collaboration.inviteAccepted + viewModel.id, viewModel.collaborationAccepted);
            }

            return viewModel;

            function deactivate() {
                if (!viewModel.isRemoving()) {
                    viewModel.isRemoveConfirmationShown(false);
                }

                app.off(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
                app.off(constants.messages.course.collaboration.inviteAccepted + viewModel.id, viewModel.collaborationAccepted);
            }

            function showRemoveConfirmation() {
                viewModel.isRemoveConfirmationShown(true);
            }

            function hideRemoveConfirmation() {
                viewModel.isRemoveConfirmationShown(false);
            }

            function removeCollaborator() {
                eventTracker.publish(events.removeCollaborator);
                var collaborationId = viewModel.id;
                var courseId = router.routeData().courseId;

                viewModel.isRemoving(true);
                app.trigger(constants.messages.course.collaboration.deleting.started + collaborationId, collaborationId);

                return collaboratorRepository.remove(courseId, collaborationId)
                    .then(function (collaboration) {
                        viewModel.isRemoveSuccessMessageShown(true);
                        app.trigger(constants.messages.course.collaboration.deleting.completed + collaborationId, collaboration);
                        app.trigger(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaboration.email);
                    })
                    .fail(function (errorMessage) {
                        viewModel.hideRemoveConfirmation();
                        app.trigger(constants.messages.course.collaboration.deleting.failed + collaborationId, errorMessage);
                    })
                    .fin(function () {
                        viewModel.isRemoving(false);
                    });
            }

            function collaboratorRegistered(userInfo) {
                viewModel.name(userInfo.fullName);
                viewModel.isRegistered(true);

                app.off(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
            }

            function collaborationAccepted() {
                viewModel.isAccepted(true);

                app.off(constants.messages.course.collaboration.inviteAccepted + viewModel.id, viewModel.collaborationAccepted);
            }

            function lock() {
                if (viewModel.isOwner)
                    return;

                viewModel.isLocked(true);
            }

            function unlock() {
                if (viewModel.isOwner)
                    return;

                viewModel.isLocked(false);
            }
        };

        return ctor;
    });
