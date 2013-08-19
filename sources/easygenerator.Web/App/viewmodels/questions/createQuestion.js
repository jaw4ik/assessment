﻿define(['dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/questionRepository'],
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
         showValidation = ko.observable(),
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
                 this.showValidation(true);
                 return undefined;
             }

             this.showValidation(false);
             sendEvent(events.saveAndOpen);

             var that = this;
             return questionRepository.create(that.objectiveId, { title: that.title() }).then(function (newQuestion) {
                 router.navigate('objective/' + that.objectiveId + '/question/' + newQuestion.id);
             });
         },

        saveAndNew = function () {
            if (!this.title.isValid()) {
                this.title.isModified(true);
                this.title.isEditing(true);
                this.showValidation(true);
                return undefined;
            }

            this.showValidation(false);
            sendEvent(events.saveAndNew);

            var that = this;
            return questionRepository.create(that.objectiveId, { title: that.title() }).then(function () {
                that.title('');
                that.title.isModified(false);
                that.title.isEditing(true);
            });
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
                     that.showValidation(false);
                     that.title('');
                     that.title.isModified(false);
                     that.title.isEditing(false);
                 });
         },

        viewAttached = function () {
            var that = this;
            setTimeout(function () {
                that.title.isEditing(true);
            }, 100);
        };

        return {
            activate: activate,
            viewAttached: viewAttached,
            objectiveId: objectiveId,
            title: title,
            showValidation: showValidation,
            objectiveTitle: objectiveTitle,

            navigateToObjective: navigateToObjective,
            saveAndOpen: saveAndOpen,
            saveAndNew: saveAndNew
        };
    }
);