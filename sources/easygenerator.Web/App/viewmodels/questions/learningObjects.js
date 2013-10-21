define(['repositories/learningObjectRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker'], function (repository, localizationManager, notify, constants, eventTracker) {

    var
        events = {
            addLearningObject: 'Add learning object',
            deleteLearningObject: 'Delete learning object',
            beginEditText: 'Start editing learning object',
            endEditText: 'End editing learning object'
        };

    var ctor = function (questionId, lo) {

        var
            learningObjects = ko.observableArray([]),
            isExpanded = ko.observable(true),

            addLearningObject = function () {
                eventTracker.publish(events.addLearningObject);
                doAddLearningObject();
            },

            removeLearningObject = function (learningObject) {
                eventTracker.publish(events.deleteLearningObject);

                performActionWhenLearningObjectIdIsSet(learningObject, function () {
                    learningObjects.remove(learningObject);
                    repository.removeLearningObject(questionId, ko.unwrap(learningObject.id)).then(function (response) {
                        showNotification(response.modifiedOn);
                    });
                });
            },

            beginEditText = function () {
                eventTracker.publish(events.beginEditText);
            },

            endEditText = function (learningObject) {
                eventTracker.publish(events.endEditText);
                var id = ko.unwrap(learningObject.id);
                var text = ko.unwrap(learningObject.text);

                if (_.isEmptyHtmlText(text)) {
                    learningObjects.remove(learningObject);
                    if (!_.isEmptyOrWhitespace(id)) {
                        repository.removeLearningObject(questionId, id).then(function (modifiedOn) {
                            showNotification(modifiedOn);
                        });
                    }
                }
            },

            updateText = function (learningObject) {
                var id = ko.unwrap(learningObject.id);
                var text = ko.unwrap(learningObject.text);

                if (_.isEmptyHtmlText(text)) {
                    return;
                }

                if (_.isEmptyOrWhitespace(id)) {
                    repository.addLearningObject(questionId, { text: text }).then(function (item) {
                        learningObject.id(item.id);
                        learningObject.originalText = text;
                        showNotification(item.createdOn);
                    });
                } else {
                    if (text != learningObject.originalText) {
                        repository.updateText(questionId, id, text).then(function (response) {
                            learningObject.originalText = text;
                            showNotification(response.modifiedOn);
                        });
                    }
                }
            },

            toggleExpand = function () {
                isExpanded(!isExpanded());
            },

            canAddLearningObject = ko.computed({
                read: function () {
                    return !_.some(learningObjects(), function (item) {
                        return _.isEmptyOrWhitespace(ko.unwrap(item.id));
                    });
                },
                deferEvaluation: true
            })
        ;

        function doAddLearningObject(learningObject) {
            learningObject = learningObject || { id: '', text: '', hasFocus: true };
            learningObjects.push({
                id: ko.observable(learningObject.id),
                text: ko.observable(learningObject.text),
                originalText: learningObject.text,
                hasFocus: ko.observable(learningObject.hasFocus || false)
            });
        }


        function performActionWhenLearningObjectIdIsSet(learningObject, action) {
            if (_.isEmptyOrWhitespace(ko.unwrap(learningObject.id))) {
                var subscription = learningObject.id.subscribe(function () {
                    if (!_.isEmptyOrWhitespace(ko.unwrap(learningObject.id))) {
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
            doAddLearningObject(item);
        });

        return {
            learningObjects: learningObjects,

            addLearningObject: addLearningObject,
            removeLearningObject: removeLearningObject,
            updateText: updateText,

            beginEditText: beginEditText,
            endEditText: endEditText,

            isExpanded: isExpanded,
            toggleExpand: toggleExpand,

            canAddLearningObject: canAddLearningObject,

            autosaveInterval: constants.autosaveTimersInterval.learningObject
        };

    };


    return ctor;
});
