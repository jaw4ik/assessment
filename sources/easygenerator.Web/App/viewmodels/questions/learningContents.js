define(['repositories/learningContentRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app'],
    function (repository, localizationManager, notify, constants, eventTracker, app) {

    var
        events = {
            addLearningContent: 'Add learning content',
            deleteLearningContent: 'Delete learning content',
            beginEditText: 'Start editing learning content',
            endEditText: 'End editing learning content'
        };

    var ctor = function (questionId, lo) {

        var learningContents = ko.observableArray([]),
            isExpanded = ko.observable(true),

            addLearningContent = function () {
                eventTracker.publish(events.addLearningContent);
                doAddLearningContent();
            },

            removeLearningContent = function (learningContent) {
                eventTracker.publish(events.deleteLearningContent);

                performActionWhenLearningContentIdIsSet(learningContent, function () {
                    learningContents.remove(learningContent);
                    repository.removeLearningContent(questionId, ko.unwrap(learningContent.id)).then(function (response) {
                        showNotification(response.modifiedOn);
                    });
                });
            },

            beginEditText = function () {
                eventTracker.publish(events.beginEditText);
            },

            endEditText = function (learningContent) {
                eventTracker.publish(events.endEditText);

                if (!_.isNullOrUndefined(learningContent.isDeleted) && learningContent.isDeleted) {
                    learningContents.remove(learningContent);
                    return;
                }

                var id = ko.unwrap(learningContent.id);
                var text = ko.unwrap(learningContent.text);

                if (_.isEmptyHtmlText(text)) {
                    learningContents.remove(learningContent);
                    if (!_.isEmptyOrWhitespace(id)) {
                        repository.removeLearningContent(questionId, id).then(function (modifiedOn) {
                            showNotification(modifiedOn);
                        });
                    }
                }
            },

            updateText = function (learningContent) {
                var id = ko.unwrap(learningContent.id);
                var text = ko.unwrap(learningContent.text);

                if (_.isEmptyHtmlText(text)) {
                    return;
                }

                if (_.isEmptyOrWhitespace(id)) {
                    repository.addLearningContent(questionId, { text: text }).then(function (item) {
                        learningContent.id(item.id);
                        learningContent.originalText = text;
                        showNotification(item.createdOn);
                    });
                } else {
                    if (text != learningContent.originalText) {
                        repository.updateText(questionId, id, text).then(function (response) {
                            learningContent.originalText = text;
                            showNotification(response.modifiedOn);
                        });
                    }
                }
            },

            toggleExpand = function () {
                isExpanded(!isExpanded());
            },

            canAddLearningContent = ko.computed({
                read: function () {
                    return !_.some(learningContents(), function (item) {
                        return _.isEmptyOrWhitespace(ko.unwrap(item.id));
                    });
                },
                deferEvaluation: true
            }),

            deletedByCollaborator = function (question, learningContentId) {
                var deletedLearningContent = _.find(learningContents(), function (item) {
                    return item.id() == learningContentId;
                });

                if (_.isNullOrUndefined(deletedLearningContent))
                    return;

                if (deletedLearningContent.hasFocus()) {
                    deletedLearningContent.isDeleted = true;
                    notify.error(localizationManager.localize('learningContentHasBeenDeletedByCollaborator'));
                } else {
                    learningContents.remove(deletedLearningContent);
                }
            },

            textUpdatedByCollaborator = function (question, learningContent) {
                var updatedLearningContent = _.find(learningContents(), function (item) {
                    return item.id() == learningContent.id;
                });

                if (_.isNullOrUndefined(updatedLearningContent))
                    return;

                updatedLearningContent.originalText = learningContent.text;
                if(!updatedLearningContent.hasFocus())
                    updatedLearningContent.text(learningContent.text);
            },

            createdByCollaborator = function (question, learningContent) {
                doAddLearningContent(learningContent);
            }
        ;

        function doAddLearningContent(learningContent) {
            learningContent = learningContent || { id: '', text: '', hasFocus: true };
            learningContents.push({
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

        function showNotification(date) {
            notify.saved();
        }

        _.each(lo, function (item) {
            doAddLearningContent(item);
        });

        app.on(constants.messages.question.learningContent.createdByCollaborator, createdByCollaborator);
        app.on(constants.messages.question.learningContent.deletedByCollaborator, deletedByCollaborator);
        app.on(constants.messages.question.learningContent.textUpdatedByCollaborator, textUpdatedByCollaborator);

        return {
            learningContents: learningContents,

            addLearningContent: addLearningContent,
            removeLearningContent: removeLearningContent,

            createdByCollaborator: createdByCollaborator,
            deletedByCollaborator: deletedByCollaborator,
            textUpdatedByCollaborator: textUpdatedByCollaborator,

            updateText: updateText,
            beginEditText: beginEditText,
            endEditText: endEditText,

            isExpanded: isExpanded,
            toggleExpand: toggleExpand,

            canAddLearningContent: canAddLearningContent,

            autosaveInterval: constants.autosaveTimersInterval.learningContent
        };

    };


    return ctor;
});
