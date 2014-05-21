define(['viewModels/courses/collaboration/collaborator', 'plugins/dialog', 'eventTracker', 'durandal/app', 'constants'],
    function (vmCollaborator, dialog, eventTracker, app, constants) {

        var
            events = {
                openAddCourseCollaboratorDialog: 'Open "add people for collaboration" dialog'
            };

        var viewModel = function (courseOwner, collaborators) {

            var members = ko.observableArray([]);

            _.forEach(collaborators, function (item) {
                members.push(new vmCollaborator(courseOwner, item));
            });

            var addMember = function () {
                eventTracker.publish(events.openAddCourseCollaboratorDialog);
                dialog.show('dialogs/collaboration/addCollaborator');
            };

            var collaboratorAdded = function (collaborator) {
                members.push(new vmCollaborator(courseOwner, collaborator));
            }

            app.on(constants.messages.course.collaboration.collaboratorAdded, collaboratorAdded);

            return {
                members: members,
                addMember: addMember,
                collaboratorAdded: collaboratorAdded
            };
        };

        return viewModel;
    });
