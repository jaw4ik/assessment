define(['viewModels/courses/collaboration/collaborator', 'plugins/dialog', 'eventTracker', 'durandal/app', 'constants', 'userContext'],
    function (vmCollaborator, dialog, eventTracker, app, constants, userContext) {

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
                dialog.show('dialogs/collaboration/addCollaborator');
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
                canAddMember: userContext.identity.email === courseOwner,
                collaboratorAdded: collaboratorAdded
            };
        };

        return viewModel;
    });
