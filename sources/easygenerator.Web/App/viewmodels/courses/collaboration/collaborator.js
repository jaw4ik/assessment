define(['localization/localizationManager'],
    function (localizationManager) {

        var viewModel = function (courseOwner, collaborator) {

            var name = _.isEmptyOrWhitespace(collaborator.fullName)
                    ? collaborator.email
                    : collaborator.fullName,

                avatarLetter = name.charAt(0),
                isOwner = collaborator.email == courseOwner,
                displayName = isOwner ? name + ': ' + localizationManager.localize('owner') : name;

            return {
                id: collaborator.id,
                name: name,
                displayName: displayName,
                avatarLetter: avatarLetter,
                isOwner: isOwner,
                createdOn: collaborator.createdOn
            };
        };

        return viewModel;
    });
