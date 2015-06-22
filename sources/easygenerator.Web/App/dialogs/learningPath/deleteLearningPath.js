define(['eventTracker', 'durandal/app', 'constants', 'dialogs/learningPath/commands/deleteLearningPathCommand'],
    function (eventTracker, app, constants, deleteLearningPathCommand) {
        var events = {
            confirmDelete: 'Confirm delete learning path',
            cancelDelete: 'Cancel delete learning path'
        };

        var viewModel = {
            isShown: ko.observable(false),
            isDeleting: ko.observable(false),
            learningPathId: '',
            learningPathTitle: ko.observable(''),
            deleteLearningPath: deleteLearningPath,
            show: show,
            close: close
        };

        return viewModel;

        function show(learningPathId, learningPathTitle) {
            viewModel.learningPathId = learningPathId;
            viewModel.learningPathTitle(learningPathTitle);
            viewModel.isShown(true);
        }

        function close() {
            eventTracker.publish(events.cancelDelete);
            viewModel.isShown(false);
        }

        function deleteLearningPath() {
            viewModel.isDeleting(true);
            eventTracker.publish(events.confirmDelete);
            deleteLearningPathCommand.execute(viewModel.learningPathId)
                .then(function () {
                    app.trigger(constants.messages.learningPath.deleted, viewModel.learningPathId);
                    viewModel.isShown(false);
                })
                .fin(function () {
                    viewModel.isDeleting(false);
                });
        }
    });