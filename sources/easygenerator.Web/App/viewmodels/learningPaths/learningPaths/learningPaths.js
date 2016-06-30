define(['./commands/createLearningPathCommand', './queries/getLearningPathCollectionQuery',
    './learningPathBrief', 'dialogs/learningPath/deleteLearningPath', 'durandal/app', 'constants', 'eventTracker'],
    function (createLearningPathCommand, getLearningPathCollectionQuery, LearningPathBrief, deleteLearningPathDialog, app, constants, eventTracker) {
        "use strict";

        var events = {
            deleteLearningPath: 'Open \'Delete learning path\' dialog',
            createLearningPath: 'Create learning path and open its properties'
        };

        var viewModel = {
            activate: activate,
            deactivate: deactivate,
            learningPaths: ko.observable([]),
            createLearningPath: createLearningPath,
            deleteLearningPath: deleteLearningPath,
            learningPathDeleted: learningPathDeleted,
            deleteLearningPathDialog: deleteLearningPathDialog
        };

        return viewModel;

        function activate() {
            app.on(constants.messages.learningPath.deleted, viewModel.learningPathDeleted);

            return getLearningPathCollectionQuery.execute()
                .then(function (receivedLearningPaths) {
                    var collection = _.chain(receivedLearningPaths)
                      .sortBy(function (item) { return -item.createdOn; })
                      .map(function (item) {
                          return new LearningPathBrief(item);
                      }).value();

                    viewModel.learningPaths(collection);
                });
        }

        function deactivate() {
            app.off(constants.messages.learningPath.deleted, viewModel.learningPathDeleted);
        }

        function createLearningPath() {
            eventTracker.publish(events.createLearningPath);
            return createLearningPathCommand.execute();
        }

        function deleteLearningPath(learningPath) {
            eventTracker.publish(events.deleteLearningPath);
            deleteLearningPathDialog.show(learningPath.id, learningPath.title());
        }

        function learningPathDeleted(learningPathId) {
            viewModel.learningPaths(_.reject(viewModel.learningPaths(), function (item) {
                return item.id === learningPathId;
            }));
        }
    }
);