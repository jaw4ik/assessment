define(['localization/localizationManager'],
    function (localizationManager) {

        var viewModel = function (courseOwner, collaborator) {

            var name = _.isNullOrUndefined(collaborator.fullName) || _.isEmptyOrWhitespace(collaborator.fullName)
                    ? collaborator.email
                    : collaborator.fullName,

                avatarLetter = collaborator.registered ? name.charAt(0) : '?',
                isOwner = collaborator.email == courseOwner,
                displayName = isOwner ? name + ': ' + localizationManager.localize('owner') : name;

            if (!collaborator.registered) {
                displayName += ':\n' + localizationManager.localize('waitingForRegistration');
            }

            return {
                id: collaborator.id,
                displayName: displayName,
                avatarLetter: avatarLetter,
                isOwner: isOwner,
                registered: collaborator.registered,
                createdOn: collaborator.createdOn
            };
        };

        return viewModel;
    });
