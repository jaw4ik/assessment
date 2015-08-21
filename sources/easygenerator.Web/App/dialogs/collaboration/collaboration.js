define(['eventTracker', 'plugins/dialog', 'dialogs/collaboration/addCollaborator', 'constants', 'plugins/router', 'repositories/collaboratorRepository', 'localization/localizationManager',
    'durandal/app', 'userContext', 'dialogs/collaboration/collaborator', 'guard'],
    function (eventTracker, dialog, addCollaboratorViewModel, constants, router, repository, localizationManager, app, userContext, vmCollaborator, guard) {
        "use strict";

        var viewModel = {
            isShown: ko.observable(false),
            collaborationWarning: ko.observable(''),
            show: show,
            hide: hide,
            courseId: '',
            courseOwner: '',
            collaboratorAdded: collaboratorAdded,
            collaboratorRemoved: collaboratorRemoved,
            addCollaboratorViewModel: addCollaboratorViewModel,
            isLoadingCollaborators: ko.observable(false),
            collaborators: ko.observableArray([])
        };

        return viewModel;

        function show(courseId, courseOwner) {
            guard.throwIfNotString(courseId, 'courseId is not a string');
            guard.throwIfNotString(courseOwner, 'courseOwner is not a string');

            reset();
            viewModel.courseOwner = courseOwner;
            addCollaboratorViewModel.isEnabled(false);
            viewModel.isLoadingCollaborators(true);

            viewModel.isShown(true);

            viewModel.courseId = courseId;
            app.on(constants.messages.course.collaboration.collaboratorAdded + viewModel.courseId, viewModel.collaboratorAdded);
            app.on(constants.messages.course.collaboration.collaboratorRemoved + viewModel.courseId, viewModel.collaboratorRemoved);

            repository.getCollection(viewModel.courseId).then(function (collaborators) {
                var collaboratorsList = _.chain(collaborators)
                       .sortBy(function (item) {
                           return item.createdOn;
                       })
                       .map(function (item) {
                           return new vmCollaborator(courseOwner, item);
                       })
                       .value();

                viewModel.collaborators(collaboratorsList);

                viewModel.isLoadingCollaborators(false);
                addCollaboratorViewModel.isEnabled(true);
            });
        }

        function collaboratorAdded(collaborator) {
            var items = viewModel.collaborators();
            items.push(new vmCollaborator(viewModel.courseOwner, collaborator));
            items = _.sortBy(items, function (item) {
                return item.createdOn;
            });

            viewModel.collaborators(items);
        }

        function collaboratorRemoved(collaboratorEmail) {
            viewModel.collaborators(_.reject(viewModel.collaborators(), function (item) {
                return item.email == collaboratorEmail;
            }));
        }

        function hide() {
            app.off(constants.messages.course.collaboration.collaboratorAdded + viewModel.courseId, viewModel.collaboratorAdded);
            app.off(constants.messages.course.collaboration.collaboratorRemoved + viewModel.courseId, viewModel.collaboratorRemoved);

            _.each(viewModel.collaborators(), function (item) {
                item.deactivate();
            });

            viewModel.isShown(false);
        }

        function reset() {
            addCollaboratorViewModel.reset();
        }
    }
);