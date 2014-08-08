define(['repositories/learningContentRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app'],
    function (repository, localizationManager, notify, constants, eventTracker, app) {

        var
            events = {
                addLearningContent: 'Add learning content',
                deleteLearningContent: 'Delete learning content',
                beginEditText: 'Start editing learning content',
                endEditText: 'End editing learning content'
            };

        var viewModel = {
            autosaveInterval: constants.autosaveTimersInterval.learningContent,
            learningContents: ko.observableArray([]),
            questionId: null,
            questionType: null,

            addLearningContent: addLearningContent,
            removeLearningContent: removeLearningContent,

            createdByCollaborator: createdByCollaborator,
            deletedByCollaborator: deletedByCollaborator,
            textUpdatedByCollaborator: textUpdatedByCollaborator,

            updateText: updateText,
            beginEditText: beginEditText,
            endEditText: endEditText,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            activate: activate,
            localizationManager: localizationManager
        };

        viewModel.canAddLearningContent = ko.computed({
            read: function () {
                return !_.some(viewModel.learningContents(), function (item) {
                    return _.isEmptyOrWhitespace(ko.unwrap(item.id));
                });
            },
            deferEvaluation: true
        });

        app.on(constants.messages.question.learningContent.createdByCollaborator, createdByCollaborator);
        app.on(constants.messages.question.learningContent.deletedByCollaborator, deletedByCollaborator);
        app.on(constants.messages.question.learningContent.textUpdatedByCollaborator, textUpdatedByCollaborator);

        return viewModel;

        function addLearningContent() {
            publishActualEvent(events.addLearningContent);
            doAddLearningContent();
        }

        function removeLearningContent(learningContent) {
            publishActualEvent(events.deleteLearningContent);

            if (!_.isNullOrUndefined(learningContent.isDeleted) && learningContent.isDeleted) {
                viewModel.learningContents.remove(learningContent);
                return;
            }

            performActionWhenLearningContentIdIsSet(learningContent, function () {
                viewModel.learningContents.remove(learningContent);
                repository.removeLearningContent(viewModel.questionId, ko.unwrap(learningContent.id)).then(function (response) {
                    showNotification(response.modifiedOn);
                });
            });
        }

        function beginEditText() {
            publishActualEvent(events.beginEditText);
        }

        function endEditText(learningContent) {
            publishActualEvent(events.endEditText);

            if (!_.isNullOrUndefined(learningContent.isDeleted) && learningContent.isDeleted) {
                viewModel.learningContents.remove(learningContent);
                return;
            }

            var id = ko.unwrap(learningContent.id);
            var text = ko.unwrap(learningContent.text);

            if (_.isEmptyHtmlText(text)) {
                viewModel.learningContents.remove(learningContent);
                if (!_.isEmptyOrWhitespace(id)) {
                    repository.removeLearningContent(viewModel.questionId, id).then(function (modifiedOn) {
                        showNotification(modifiedOn);
                    });
                }
            }
        }

        function updateText(learningContent) {
            var id = ko.unwrap(learningContent.id);
            var text = ko.unwrap(learningContent.text);

            if (_.isEmptyHtmlText(text) || ((!_.isNullOrUndefined(learningContent.isDeleted) && learningContent.isDeleted))) {
                return;
            }

            if (_.isEmptyOrWhitespace(id)) {
                repository.addLearningContent(viewModel.questionId, { text: text }).then(function (item) {
                    learningContent.id(item.id);
                    learningContent.originalText = text;
                    showNotification(item.createdOn);
                });
            } else {
                if (text != learningContent.originalText) {
                    repository.updateText(viewModel.questionId, id, text).then(function (response) {
                        learningContent.originalText = text;
                        showNotification(response.modifiedOn);
                    });
                }
            }
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function deletedByCollaborator(question, learningContentId) {
            if (question.id != viewModel.questionId) {
                return;
            }

            var deletedLearningContent = _.find(viewModel.learningContents(), function (item) {
                return item.id() == learningContentId;
            });

            if (_.isNullOrUndefined(deletedLearningContent)) {
                return;
            }

            if (deletedLearningContent.hasFocus()) {
                deletedLearningContent.isDeleted = true;
                notify.error(localizationManager.localize('learningContentHasBeenDeletedByCollaborator'));
            } else {
                viewModel.learningContents.remove(deletedLearningContent);
            }
        }

        function textUpdatedByCollaborator(question, learningContent) {
            if (question.id != viewModel.questionId) {
                return;
            }

            var updatedLearningContent = _.find(viewModel.learningContents(), function (item) {
                return item.id() == learningContent.id;
            });

            if (_.isNullOrUndefined(updatedLearningContent)) {
                return;
            }

            updatedLearningContent.originalText = learningContent.text;
            if (!updatedLearningContent.hasFocus()) {
                updatedLearningContent.text(learningContent.text);
            }
        }

        function createdByCollaborator(question, learningContent) {
            if (question.id != viewModel.questionId) {
                return;
            }

            doAddLearningContent(learningContent);
        }

        function doAddLearningContent(learningContent) {
            learningContent = learningContent || { id: '', text: '', hasFocus: true };
            viewModel.learningContents.push({
                id: ko.observable(learningContent.id),
                text: ko.observable(learningContent.text),
                originalText: learningContent.text,
                hasFocus: ko.observable(learningContent.hasFocus || false)
            });
        }

        function performActionWhenLearningContentIdIsSet(learningContent, action) {
            if (_.isEmptyOrWhitespace(ko.unwrap(learningContent.id))) {
                var subscription = learningContent.id.subscribe(function () {
                    if (!_.isEmptyOrWhitespace(ko.unwrap(learningContent.id))) {
                        action();
                        subscription.dispose();
                    }
                });
            } else {
                action();
            }
        }

        function showNotification() {
            notify.saved();
        }

        function publishActualEvent(event) {
            if (viewModel.questionType === constants.questionType.informationContent.type) {
                eventTracker.publish(event, constants.eventCategories.informationContent);
            } else {
                eventTracker.publish(event);
            }
        }

        function activate(activationData) {
            var questionId = activationData.questionId;
            var questionType = activationData.questionType;

            return repository.getCollection(questionId).then(function (learningContentsList) {
                viewModel.questionId = questionId;
                viewModel.questionType = questionType;
                viewModel.learningContents([]);
                viewModel.isExpanded(true);

                _.each(learningContentsList, doAddLearningContent);
            });
        }

    }
);
