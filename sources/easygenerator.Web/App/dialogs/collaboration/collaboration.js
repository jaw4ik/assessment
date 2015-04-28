define(['eventTracker', 'plugins/dialog', 'dialogs/collaboration/addCollaborator', 'constants', 'plugins/router', 'repositories/collaboratorRepository', 'localization/localizationManager',
    'durandal/app', 'userContext', 'dialogs/collaboration/collaborator', 'guard'],
    function (eventTracker, dialog, addCollaboratorViewModel, constants, router, repository, localizationManager, app, userContext, vmCollaborator, guard) {
        "use strict";

        var viewModel = {
            isShown: ko.observable(false),
            collaborationWarning: ko.observable(''),
            show: show,
            hide: hide,
            courseId: '',
            courseOwner: '',
            openUpgradePlanUrl: openUpgradePlanUrl,
            collaboratorAdded: collaboratorAdded,
            collaboratorRemoved: collaboratorRemoved,
            addCollaboratorViewModel: addCollaboratorViewModel,
            isLoadingCollaborators: ko.observable(false),
            collaborators: ko.observableArray([]),
            updateCollaborationStatus: updateCollaborationStatus,
            isCollaborationLocked: ko.observable(false),
            isAddCollaboratorLocked: ko.observable(false),
            isUpgradeInvitationShown: ko.observable(false)
        };

        return viewModel;

        function show(courseId, courseOwner) {
            guard.throwIfNotString(courseId, 'courseId is not a string');
            guard.throwIfNotString(courseOwner, 'courseOwner is not a string');

            reset();
            viewModel.courseOwner = courseOwner;
            addCollaboratorViewModel.isEnabled(false);
            viewModel.isLoadingCollaborators(true);

            viewModel.isShown(true);

            viewModel.courseId = courseId;
            app.on(constants.messages.course.collaboration.collaboratorAdded + viewModel.courseId, viewModel.collaboratorAdded);
            app.on(constants.messages.course.collaboration.collaboratorRemoved + viewModel.courseId, viewModel.collaboratorRemoved);

            if (courseOwner === userContext.identity.email) {
                app.on(constants.messages.user.downgraded, viewModel.updateCollaborationStatus);
                app.on(constants.messages.user.upgradedToStarter, viewModel.updateCollaborationStatus);
                app.on(constants.messages.user.upgradedToPlus, viewModel.updateCollaborationStatus);
            }

            repository.getCollection(viewModel.courseId).then(function (collaborators) {
                var collaboratorsList = _.chain(collaborators)
                       .sortBy(function (item) {
                           return item.createdOn;
                       })
                       .map(function (item) {
                           return new vmCollaborator(courseOwner, item);
                       })
                       .value();

                viewModel.collaborators(collaboratorsList);
                viewModel.updateCollaborationStatus();

                viewModel.isLoadingCollaborators(false);
                addCollaboratorViewModel.isEnabled(true);
            });
        }

        function collaboratorAdded(collaborator) {
            var items = viewModel.collaborators();
            items.push(new vmCollaborator(viewModel.courseOwner, collaborator));
            items = _.sortBy(items, function (item) {
                return item.createdOn;
            });

            viewModel.collaborators(items);
            viewModel.updateCollaborationStatus();
        }

        function collaboratorRemoved(collaboratorEmail) {
            viewModel.collaborators(_.reject(viewModel.collaborators(), function (item) {
                return item.email == collaboratorEmail;
            }));

            viewModel.updateCollaborationStatus();
        }

        function hide() {
            app.off(constants.messages.course.collaboration.collaboratorAdded + viewModel.courseId, viewModel.collaboratorAdded);
            app.off(constants.messages.course.collaboration.collaboratorRemoved + viewModel.courseId, viewModel.collaboratorRemoved);

            _.each(viewModel.collaborators(), function (item) {
                item.deactivate();
            });

            if (viewModel.courseOwner === userContext.identity.email) {
                app.off(constants.messages.user.downgraded, viewModel.updateCollaborationStatus);
                app.off(constants.messages.user.upgradedToStarter, viewModel.updateCollaborationStatus);
                app.off(constants.messages.user.upgradedToPlus, viewModel.updateCollaborationStatus);
            }

            viewModel.isShown(false);
        }

        function openUpgradePlanUrl() {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.collaboration);
            router.openUrl(constants.upgradeUrl);
        }

        function updateCollaborationStatus() {
            var collaboratorsCount = viewModel.collaborators().length;

            if (userContext.identity.subscription.accessType === constants.accessType.free) {
                viewModel.isUpgradeInvitationShown(collaboratorsCount === 1);
                lockCollaboration();
                viewModel.isAddCollaboratorLocked(true);
                viewModel.collaborationWarning(localizationManager.localize('addCollaboratorFreeWarning'));
            }
            else if (userContext.identity.subscription.accessType === constants.accessType.starter) {
                viewModel.isUpgradeInvitationShown(false);
                if (collaboratorsCount > constants.maxStarterPlanCollaborators + 1) {
                    lockCollaboration();
                } else {
                    unlockCollaboration();
                }

                viewModel.isAddCollaboratorLocked(collaboratorsCount >= constants.maxStarterPlanCollaborators + 1);
                viewModel.collaborationWarning(localizationManager.localize('addCollaboratorStarterWarning'));
            }
            else {
                viewModel.isUpgradeInvitationShown(false);
                unlockCollaboration();
                viewModel.isAddCollaboratorLocked(false);
                viewModel.collaborationWarning('');
            }
        }

        function lockCollaboration() {
            viewModel.isCollaborationLocked(true);
            _.each(viewModel.collaborators(), function (item) {
                item.lock();
            });
        }

        function unlockCollaboration() {
            viewModel.isCollaborationLocked(false);
            _.each(viewModel.collaborators(), function (item) {
                item.unlock();
            });
        }

        function reset() {
            addCollaboratorViewModel.reset();
            viewModel.isUpgradeInvitationShown(false);
            viewModel.isCollaborationLocked(false);
            viewModel.isAddCollaboratorLocked(false);
        }
    }
);