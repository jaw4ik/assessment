define(['repositories/learningContentRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker'], function (repository, localizationManager, notify, constants, eventTracker) {

    var
        events = {
            addLearningContent: 'Add learning content',
            deleteLearningContent: 'Delete learning content',
            beginEditText: 'Start editing learning content',
            endEditText: 'End editing learning content'
        };

    var ctor = function (questionId, lo) {

        var
            learningContents = ko.observableArray([]),
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
            })
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
            notify.info(localizationManager.localize('savedAt') + ' ' + date.toLocaleTimeString());
        }

        _.each(lo, function (item) {
            doAddLearningContent(item);
        });

        return {
            learningContents: learningContents,

            addLearningContent: addLearningContent,
            removeLearningContent: removeLearningContent,
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
