define(['viewmodels/learningPaths/queries/getLearningPathByIdQuery', 'plugins/router'],
    function (getLearningPathByIdQuery, router) {
        "use strict";

        var
            viewModel = {
                learningPathId: null,
                title: ko.observable(''),
                activate: activate,
                canActivate: canActivate,
                back: back
            };

        return viewModel;

        function back() {
            router.navigate('#learningpaths');
        }

        function canActivate(learningPathId) {
            return getLearningPathByIdQuery.execute(learningPathId)
                .then(function (learningPath) {
                    if (_.isObject(learningPath)) {
                        return true;
                    }

                return { redirect: '404' };
            });
        }

        function activate(learningPathId) {
            viewModel.learningPathId = learningPathId;

            return getLearningPathByIdQuery.execute(viewModel.learningPathId).then(function (learningPath) {
                viewModel.title(learningPath.title);
            });
        }
    }
);