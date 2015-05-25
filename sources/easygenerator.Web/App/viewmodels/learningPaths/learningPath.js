define(['viewmodels/learningPaths/queries/getLearningPathByIdQuery', 'plugins/router', 'viewmodels/common/titleField', 'constants', 'localization/localizationManager', 'viewmodels/learningPaths/commands/updateLearningPathTitleCommand'],
    function (getLearningPathByIdQuery, router, titleField, constants, localizationManager,updateTitleCommand) {
        "use strict";

        var
            events = {
                updateTitle: 'Update learning path title'
            },
            viewModel = {
                id: null,
                title: ko.observable(''),
                activate: activate,
                canActivate: canActivate,
                back: back
            };

        viewModel.titleField = titleField('', constants.validation.learningPathTitleMaxLength, localizationManager.localize('learningPathTitle'), events.updateTitle, getTitle, updateTitle);

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
            viewModel.id = learningPathId;

            return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
                viewModel.titleField.title(learningPath.title);
            });
        }

        function getTitle() {
            return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
                return learningPath.title;
            });
        }

        function updateTitle(title) {
            return updateTitleCommand.execute(viewModel.id, title);
        }
    }
);