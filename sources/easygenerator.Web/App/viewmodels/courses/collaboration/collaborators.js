define(['viewModels/courses/collaboration/collaborator'],
    function (vmCollaborator) {

        var viewModel = function (courseOwner, collaborators) {

            var members = ko.observableArray([]);

            _.forEach(collaborators, function (item) {
                members.push(new vmCollaborator(courseOwner, item));
            });

            return {
                members: members
            };
        };

        return viewModel;
    });
