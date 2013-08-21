define(['dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/questionRepository'],
    function (dataContext, constants, eventTracker, router, objectiveRepository, questionRepository) {
        "use strict";

        var
           events = {
               category: 'Create Question',
               navigateToObjective: 'Navigate to objective',
               saveAndOpen: 'Save and edit question',
               saveAndNew: 'Save and create question'
           },

           sendEvent = function (eventName) {
               eventTracker.publish(eventName, events.category);
           };

        var objectiveId = null,
         objectiveTitle = null,
         title = ko.observable('').extend({
             required: true,
             maxLength: 255
         });
        title.isEditing = ko.observable();

        var navigateToObjective = function () {
            sendEvent(events.navigateToObjective);
            router.navigate('objective/' + this.objectiveId);
        },

         saveAndOpen = function () {
             if (!this.title.isValid()) {
                 this.title.isModified(true);
                 this.title.isEditing(true);
                 return;
             }

             sendEvent(events.saveAndOpen);

             var that = this;
             questionRepository.add(that.objectiveId, { title: that.title() }).then(function (newQuestionId) {
                 router.navigate('objective/' + that.objectiveId + '/question/' + newQuestionId);
             });
         },

        saveAndNew = function () {
            if (!this.title.isValid()) {
                this.title.isModified(true);
                this.title.isEditing(true);
                return;
            }

            sendEvent(events.saveAndNew);

            var that = this;
            questionRepository.add(that.objectiveId, { title: that.title() }).then(function () {
                that.title('');
                that.title.isModified(false);
                that.title.isEditing(true);
            });
        },

        endEditTitle = function () {
            this.title.isEditing(false);
        },

         activate = function (objId) {
             if (!_.isString(objId)) {
                 router.navigate('400');
                 return undefined;
             }

             var that = this;
             return objectiveRepository.getById(objId).then(
                 function (objective) {
                     if (_.isNull(objective)) {
                         router.navigate('404');
                         return;
                     }

                     that.objectiveId = objective.id;
                     that.objectiveTitle = objective.title;
                     that.title('');
                     that.title.isModified(false);
                     that.title.isEditing(false);
                 });
         },

        attached = function () {
            var that = this;
            setTimeout(function () {
                that.title.isEditing(true);
            }, 100);
        };

        return {
            activate: activate,
            attached: attached,
            objectiveId: objectiveId,
            title: title,
            objectiveTitle: objectiveTitle,

            navigateToObjective: navigateToObjective,
            endEditTitle: endEditTitle,
            saveAndOpen: saveAndOpen,
            saveAndNew: saveAndNew
        };
    }
);