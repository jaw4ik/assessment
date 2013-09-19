define(['dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/questionRepository', 'localization/localizationManager', 'notify'],
    function (dataContext, constants, eventTracker, router, objectiveRepository, questionRepository, localizationManager, notify) {
        "use strict";

        var
           events = {
               navigateToObjective: 'Navigate to objective',
               saveAndOpen: 'Save and edit question',
               saveAndNew: 'Save and create question'
           },

           sendEvent = function (eventName) {
               eventTracker.publish(eventName);
           };

        var objectiveId = null,
         objectiveTitle = null,
         title = ko.observable('');
        
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.questionTitleMaxLength;
        });
        title.isModified = ko.observable();
        title.isEditing = ko.observable();

        var navigateToObjective = function () {
            sendEvent(events.navigateToObjective);
            router.navigateWithQueryString('objective/' + this.objectiveId);
        },
            saveAndOpen = function () {
                this.title(this.title().trim());
                if (!this.title.isValid()) {
                    this.title.isModified(true);
                    this.title.isEditing(true);
                    return;
                }

                sendEvent(events.saveAndOpen);

                var that = this;
                questionRepository.addQuestion(that.objectiveId, { title: that.title() }).then(function (newQuestionId) {
                    router.navigateWithQueryString('objective/' + that.objectiveId + '/question/' + newQuestionId);
                });
            },
            saveAndNew = function () {
                this.title(this.title().trim());
                if (!this.title.isValid()) {
                    this.title.isModified(true);
                    this.title.isEditing(true);
                    return;
                }

                sendEvent(events.saveAndNew);

                var that = this;
                questionRepository.addQuestion(that.objectiveId, { title: that.title() }).then(function () {
                    that.title('');
                    that.title.isModified(false);
                    that.title.isEditing(true);

                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                });
            },
            endEditTitle = function () {
                this.title.isEditing(false);
            },
            activate = function (objId) {
                if (!_.isString(objId)) {
                    router.replace('400');
                    return undefined;
                }

                var that = this;
                return objectiveRepository.getById(objId).then(
                    function (objective) {
                        if (_.isNullOrUndefined(objective)) {
                            router.replace('404');
                            return;
                        }

                        that.objectiveId = objective.id;
                        that.objectiveTitle = objective.title;
                        that.title('');
                        that.title.isModified(false);
                        that.title.isEditing(false);
                    });
            }
        ;

        return {
            activate: activate,
            titleMaxLength: constants.validation.questionTitleMaxLength,
            title: title,
            objectiveTitle: objectiveTitle,

            navigateToObjective: navigateToObjective,
            endEditTitle: endEditTitle,
            saveAndOpen: saveAndOpen,
            saveAndNew: saveAndNew
        };
    }
);