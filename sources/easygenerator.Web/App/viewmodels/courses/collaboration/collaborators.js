define(['viewModels/courses/collaboration/collaborator'],
    function (vmCollaborator) {

        var viewModel = function (courseOwner, collaborators) {

            var members = ko.observableArray([]);

            _.forEach(collaborators, function (item) {
                members.push(new vmCollaborator(courseOwner, item));
            });

            var addMember = function () {
                alert('Not implemented yet :)\n\nHave a nice day!');
            };

            return {
                members: members,
                addMember: addMember
            };
        };

        return viewModel;
    });
