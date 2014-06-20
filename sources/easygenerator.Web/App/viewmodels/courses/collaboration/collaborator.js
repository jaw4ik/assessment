define(['localization/localizationManager', 'durandal/app', 'constants'],
    function (localizationManager, app, constants) {

        var ctor = function (courseOwner, collaborator) {

            var viewModel = {
                email: collaborator.email,
                displayName: ko.observable(''),
                isOwner: collaborator.email == courseOwner,
                registered: ko.observable(collaborator.registered),
                createdOn: collaborator.createdOn,

                collaboratorRegistered: collaboratorRegistered,
                deactivate: deactivate
            }

            viewModel.displayName(getDisplayName(collaborator, viewModel.isOwner));
            viewModel.avatarLetter = ko.computed(function() {
                return viewModel.registered() ? viewModel.displayName().charAt(0) : '?';
            });

            if (!viewModel.registered()) {
                app.on(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
            }

            return viewModel;

            function getDisplayName(user, isOwner) {
                var name = _.isNullOrUndefined(user.fullName) || _.isEmptyOrWhitespace(user.fullName)
                    ? user.email
                    : user.fullName;

                if (isOwner) {
                    return name + ': ' + localizationManager.localize('owner');
                }

                return user.registered ? name : name + ':\n' + localizationManager.localize('waitingForRegistration');
            }

            function deactivate() {
                app.off(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
            }

            function collaboratorRegistered(userInfo) {
                viewModel.displayName(userInfo.fullName);
                viewModel.registered(true);

                app.off(constants.messages.course.collaboration.collaboratorRegistered + viewModel.email, viewModel.collaboratorRegistered);
            }
        };

        return ctor;
    });
