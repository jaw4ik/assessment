﻿define(['viewModels/courses/collaboration/collaborator', 'dialogs/collaboration/addCollaborator', 'eventTracker', 'durandal/app', 'constants', 'userContext', 'repositories/collaboratorRepository', 'guard'],
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
            addMemberDialog: addCollaboratorDialog,

            addMember: addMember,
            collaboratorAdded: collaboratorAdded,
            collaboratorRemoved: collaboratorRemoved,
            activate: activate,
            deactivate: deactivate
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
        }
    });
