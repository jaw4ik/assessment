define([],
    function () {

        var viewModel = function (courseOwner, collaborator) {

            var name = _.isEmptyOrWhitespace(collaborator.fullName)
                 ? collaborator.email
                 : collaborator.fullName,

                avatarLetter = name.charAt(0),
                    isOwner = collaborator.email == courseOwner;

            return {
                name: name,
                avatarLetter: avatarLetter,
                isOwner: isOwner
            };
        };

        return viewModel;
    });
