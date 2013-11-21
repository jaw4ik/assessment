define(['dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/questionRepository', 'localization/localizationManager', 'notify'],
    function (dataContext, constants, eventTracker, router, objectiveRepository, questionRepository, localizationManager, notify) {
        "use strict";

        var
           events = {
               navigateToObjective: 'Navigate to objective',
               saveAndOpen: 'Save and edit question',
               saveAndNew: 'Save and create question'
           };

        var
            objectiveId = null,
            objectiveTitle = null,
            title = ko.observable(''),
            goBackTooltip = '';

        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.questionTitleMaxLength;
        });
        title.isModified = ko.observable();
        title.isEditing = ko.observable();

        var
            navigateToObjective = function () {
                eventTracker.publish(events.navigateToObjective);
                router.navigateWithQueryString('objective/' + this.objectiveId);
            },

            saveAndOpen = function () {
                this.title(this.title().trim());
                if (!this.title.isValid()) {
                    this.title.isModified(true);
                    this.title.isEditing(true);
                    return;
                }

                eventTracker.publish(events.saveAndOpen);

                var that = this;
                notify.lockContent();
                questionRepository.addQuestion(that.objectiveId, { title: that.title() }).then(function (newQuestion) {
                    notify.unlockContent();
                    router.navigateWithQueryString('objective/' + that.objectiveId + '/question/' + newQuestion.id);
                });
            },
            
            saveAndNew = function () {
                this.title(this.title().trim());
                if (!this.title.isValid()) {
                    this.title.isModified(true);
                    this.title.isEditing(true);
                    return;
                }

                eventTracker.publish(events.saveAndNew);

                var that = this;
                notify.lockContent();
                questionRepository.addQuestion(that.objectiveId, { title: that.title() }).then(function (newQuestion) {
                    notify.unlockContent();
                    
                    that.title('');
                    that.title.isModified(false);
                    that.title.isEditing(true);
                    
                    notify.info(localizationManager.localize('savedAt') + ' ' + newQuestion.createdOn.toLocaleTimeString());
                });
            },
            
            endEditTitle = function () {
                this.title.isEditing(false);
            },
            
            activate = function (objId) {
                var that = this;
                return objectiveRepository.getById(objId).then(
                    function (objective) {
                        if (_.isNullOrUndefined(objective)) {
                            router.replace('404');
                            return;
                        }

                        that.objectiveId = objective.id;
                        that.objectiveTitle = objective.title;
                        that.goBackTooltip = localizationManager.localize('backTo') + ' ' + objective.title;
                        that.title('');
                        that.title.isModified(false);
                        that.title.isEditing(false);
                    }
                ).fail(function() {
                    router.replace('404');
                });
            };

        return {
            objectiveId: objectiveId,
            activate: activate,
            titleMaxLength: constants.validation.questionTitleMaxLength,
            title: title,
            objectiveTitle: objectiveTitle,
            goBackTooltip: goBackTooltip,
            
            navigateToObjective: navigateToObjective,
            endEditTitle: endEditTitle,
            saveAndOpen: saveAndOpen,
            saveAndNew: saveAndNew
        };
    }
);