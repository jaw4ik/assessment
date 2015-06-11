define(['viewmodels/learningPaths/learningPaths/commands/createLearningPathCommand', 'viewmodels/learningPaths/learningPaths/queries/getLearningPathCollectionQuery', 'viewmodels/learningPaths/learningPaths/learningPathBrief'],
    function (createLearningPathCommand, getLearningPathCollectionQuery, LearningPathBrief) {
        "use strict";

        var viewModel = {
            activate: activate,
            learningPaths: ko.observable([]),
            createLearningPath: createLearningPath
        };

        return viewModel;

        function activate() {
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

        function createLearningPath() {
            return createLearningPathCommand.execute();
        }
    }
);