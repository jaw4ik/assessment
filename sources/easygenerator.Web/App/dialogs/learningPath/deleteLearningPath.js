define(['eventTracker', 'durandal/app', 'constants', 'dialogs/learningPath/commands/deleteLearningPathCommand', 'widgets/dialog/dialog'],
    function (eventTracker, app, constants, deleteLearningPathCommand, dialog) {
        var events = {
            confirmDelete: 'Confirm delete learning path',
            cancelDelete: 'Cancel delete learning path'
        };

        var viewModel = {
            isDeleting: ko.observable(false),
            learningPathId: '',
            learningPathTitle: ko.observable(''),
            deleteLearningPath: deleteLearningPath,
            show: show,
            closed: closed,
            cancel: cancel
        };

        return viewModel;

        function show(learningPathId, learningPathTitle) {
            viewModel.learningPathId = learningPathId;
            viewModel.learningPathTitle(learningPathTitle);
            dialog.show(viewModel, constants.dialogs.deleteLearningPath.settings);
            dialog.on(constants.dialogs.dialogClosed, closed);
        }

        function closed() {
            if (dialog.isCancelled()) {
                eventTracker.publish(events.cancelDelete);
            }

            dialog.off(constants.dialogs.dialogClosed, closed);
        }

        function cancel() {
            eventTracker.publish(events.cancelDelete);
            dialog.close();
        }

        function deleteLearningPath() {
            viewModel.isDeleting(true);
            eventTracker.publish(events.confirmDelete);
            deleteLearningPathCommand.execute(viewModel.learningPathId)
                .then(function () {
                    app.trigger(constants.messages.learningPath.deleted, viewModel.learningPathId);
                    dialog.close();
                })
                .fin(function () {
                    viewModel.isDeleting(false);
                });
        }
    });