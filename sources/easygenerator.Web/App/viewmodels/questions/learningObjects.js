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

            addLearningObject = function () {
                eventTracker.publish(events.addLearningObject);
                doAddLearningObject();
            },
            removeLearningObject = function (learningObject) {
                eventTracker.publish(events.deleteLearningObject);
                learningObjects.remove(learningObject);
                repository.removeLearningObject(questionId, ko.unwrap(learningObject.id)).then(function (modifiedOn) {
                    showNotification(modifiedOn);
                });
            },
            beginEditText = function () {
                eventTracker.publish(events.beginEditText);
            },
            endEditText = function (learningObject) {
                eventTracker.publish(events.endEditText);
                var id = ko.unwrap(learningObject.id);
                var text = ko.unwrap(learningObject.text);

                if (_.isEmptyOrWhitespace(text)) {
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

                if (_.isEmptyOrWhitespace(text)) {
                    return;
                }

                if (_.isEmptyOrWhitespace(id)) {
                    repository.addLearningObject(questionId, { text: text }).then(function (item) {
                        learningObject.id(item.id);
                        showNotification(item.createdOn);
                    });
                } else {
                    repository.getById(id).then(function (item) {
                        if (item.text != text) {
                            repository.updateText(id, text).then(function (modifiedOn) {
                                showNotification(modifiedOn);
                            });
                        }
                    });
                }
            },

            isExpanded = ko.observable(true),
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
                hasFocus: ko.observable(learningObject.hasFocus || false)
            });
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
