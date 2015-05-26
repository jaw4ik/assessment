define(['viewmodels/learningPaths/queries/getLearningPathByIdQuery', 'plugins/router', 'viewmodels/common/titleField', 'constants', 'localization/localizationManager',
 'clientContext', 'viewmodels/learningPaths/commands/updateLearningPathTitleCommand', 'eventTracker'],
    function (getLearningPathByIdQuery, router, titleField, constants, localizationManager, clientContext, updateTitleCommand, eventTracker) {
        "use strict";

        var
            events = {
                updateTitle: 'Update learning path title',
                navigateToLearningPaths: 'Navigate to learning paths'
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
            eventTracker.publish(events.navigateToLearningPaths);
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
                viewModel.titleField.isSelected(clientContext.get(constants.clientContextKeys.lastCreatedLearningPathId) === learningPath.id);
                clientContext.remove(constants.clientContextKeys.lastCreatedLearningPathId);
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