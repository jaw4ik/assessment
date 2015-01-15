define(['viewModels/courses/collaboration/collaborator', 'dialogs/collaboration/addCollaborator', 'eventTracker', 'durandal/app', 'constants', 'userContext', 'repositories/collaboratorRepository', 'guard'],
    function (vmCollaborator, addCollaboratorDialog, eventTracker, app, constants, userContext, collaboratorRepository, guard) {
        "use strict";

        var events = {
            openAddCourseCollaboratorDialog: 'Open "add people for collaboration" dialog'
        };

        var viewModel = {
            courseId: '',
            courseOwner: '',
            members: ko.observableArray([]),
            canAddMember: ko.observable(),
            isCollaborationDisabled: ko.observable(false),
            addMemberDialog: addCollaboratorDialog,

            addMember: addMember,
            collaboratorAdded: collaboratorAdded,
            collaboratorRemoved: collaboratorRemoved,
            activate: activate,
            deactivate: deactivate,
            updateCollaborationStatus: updateCollaborationStatus
        };

        return viewModel;

        function addMember() {
            eventTracker.publish(events.openAddCourseCollaboratorDialog);
            viewModel.addMemberDialog.show();
        }

        function collaboratorAdded(collaborator) {
            var items = viewModel.members();
            items.push(new vmCollaborator(viewModel.courseOwner, collaborator));
            items = _.sortBy(items, function (item) {
                return -item.createdOn;
            });

            viewModel.members(items);
        }

        function collaboratorRemoved(collaboratorEmail) {
            viewModel.members(_.reject(viewModel.members(), function (item) {
                return item.email == collaboratorEmail;
            }));
        }

        function activate(activationData) {
            guard.throwIfNotAnObject(activationData, 'activationData is not an object');
            guard.throwIfNotString(activationData.courseId, 'courseId is not a string');
            guard.throwIfNotString(activationData.courseOwner, 'courseOwner is not a string');

            viewModel.courseId = activationData.courseId;
            viewModel.courseOwner = activationData.courseOwner;
            viewModel.canAddMember(userContext.identity.email === activationData.courseOwner);
            viewModel.isCollaborationDisabled(false);

            if (viewModel.courseOwner === userContext.identity.email) {
                app.on(constants.messages.user.downgraded, viewModel.updateCollaborationStatus);
                app.on(constants.messages.user.upgradedToStarter, viewModel.updateCollaborationStatus);
                app.on(constants.messages.user.upgradedToPlus, viewModel.updateCollaborationStatus);

                viewModel.members.subscription = viewModel.members.subscribe(function () {
                    viewModel.updateCollaborationStatus();
                });
            }

            return collaboratorRepository.getCollection(activationData.courseId)
                .then(function (collaborators) {
                    var members = _.chain(collaborators)
                        .sortBy(function (item) {
                            return -item.createdOn;
                        })
                        .map(function (item) {
                            return new vmCollaborator(activationData.courseOwner, item);
                        })
                        .value();


                    viewModel.members(members);
                    app.on(constants.messages.course.collaboration.collaboratorAdded + viewModel.courseId, viewModel.collaboratorAdded);
                    app.on(constants.messages.course.collaboration.collaboratorRemoved + viewModel.courseId, viewModel.collaboratorRemoved);
                });
        }

        function deactivate() {
            app.off(constants.messages.course.collaboration.collaboratorAdded + viewModel.courseId, viewModel.collaboratorAdded);
            app.off(constants.messages.course.collaboration.collaboratorRemoved + viewModel.courseId, viewModel.collaboratorRemoved);

            _.each(viewModel.members(), function (item) {
                item.deactivate();
            });

            if (viewModel.courseOwner === userContext.identity.email) {
                app.off(constants.messages.user.downgraded, viewModel.updateCollaborationStatus);
                app.off(constants.messages.user.upgradedToStarter, viewModel.updateCollaborationStatus);
                app.off(constants.messages.user.upgradedToPlus, viewModel.updateCollaborationStatus);

                viewModel.members.subscription.dispose();
            }
        }

        function updateCollaborationStatus() {
            var collaborationDisabled = userContext.identity.subscription.accessType === constants.accessType.free ||
                (userContext.identity.subscription.accessType === constants.accessType.starter && viewModel.members().length > constants.maxStarterPlanCollaborators + 1);
            viewModel.isCollaborationDisabled(collaborationDisabled);
        }
    });
