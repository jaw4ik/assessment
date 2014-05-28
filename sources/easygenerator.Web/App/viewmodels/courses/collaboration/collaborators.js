define(['viewModels/courses/collaboration/collaborator', 'dialogs/collaboration/addCollaborator', 'eventTracker', 'durandal/app', 'constants', 'userContext'],
    function (vmCollaborator, addCollaboratorDialog, eventTracker, app, constants, userContext) {

        var
            events = {
                openAddCourseCollaboratorDialog: 'Open "add people for collaboration" dialog'
            };

        var viewModel = function (courseId, courseOwner, collaborators) {

            var members = ko.observableArray([]);
            members(_.chain(collaborators)
                 .sortBy(function (item) {
                     return -item.createdOn;
                 })
                 .map(function (item) {
                     return new vmCollaborator(courseOwner, item);
                 })
                 .value());

            var addMember = function () {
                eventTracker.publish(events.openAddCourseCollaboratorDialog);
                addCollaboratorDialog.show();
            };

            var collaboratorAdded = function (collaboratedCourseId, collaborator) {
                if (courseId != collaboratedCourseId)
                    return;

                var items = members();
                items.push(new vmCollaborator(courseOwner, collaborator));
                items = _.sortBy(items, function (item) {
                    return -item.createdOn;
                });

                members(items);
            }

            app.on(constants.messages.course.collaboration.collaboratorAdded, collaboratorAdded);

            return {
                members: members,
                addMember: addMember,
                addMemberDialog: addCollaboratorDialog,
                canAddMember: userContext.identity.email === courseOwner,
                collaboratorAdded: collaboratorAdded
            };
        };

        return viewModel;
    });
