﻿define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router', 'repositories/objectiveRepository', 'repositories/questionRepository'],
    function (dataContext, constants, eventTracker, router, objectiveRepository, questionRepository) {
        "use strict";

        var
           events = {
               category: 'Create Question',
               navigateToObjective: 'Navigate to objective',
               saveAndEdit: 'Save and edit question',
               saveAndCreate: 'Save and create question'
           },

           sendEvent = function (eventName) {
               eventTracker.publish(eventName, events.category);
           };

        var objectiveId = null,
         showValidation = ko.observable(),
         title = ko.observable('').extend({
             required: true,
             maxLength: 255
         });
        title.isEditing = ko.observable();

        var navigateToObjective = function () {
            sendEvent(events.navigateToObjective);
            router.navigateTo('#/objective/' + this.objectiveId);
        },

         saveAndEdit = function () {
             if (!this.title.isValid()) {
                 this.showValidation(true);
                 return undefined;
             }

             this.showValidation(false);
             sendEvent(events.saveAndEdit);

             var that = this;
             return questionRepository.create(that.objectiveId, { title: that.title() }).then(function (newQuestion) {
                 router.navigateTo('#/objective/' + that.objectiveId + '/question/' + newQuestion.id);
             });
         },

        saveAndCreate = function () {
            if (!this.title.isValid()) {
                this.showValidation(true);
                return undefined;
            }

            this.showValidation(false);
            sendEvent(events.saveAndCreate);
            
            var that = this;
            return questionRepository.create(that.objectiveId, { title: that.title() }).then(function () {
                that.title('');
                that.title.isModified(false);
                that.title.isEditing(true);
            });
        },

         activate = function (routeData) {
             if (!_.isObject(routeData) || _.isNullOrUndefined(routeData.objectiveId)) {
                 router.navigateTo('#/400');
                 return undefined;
             }

             var that = this;
             return objectiveRepository.getById(routeData.objectiveId).then(
                 function (objective) {
                     if (_.isNull(objective)) {
                         router.navigateTo('#/404');
                         return;
                     }

                     that.objectiveId = objective.id;
                     that.showValidation(false);
                     that.title('');
                     that.title.isEditing(true);
                 });
         };

        return {
            activate: activate,
            objectiveId: objectiveId,
            title: title,
            showValidation: showValidation,

            navigateToObjective: navigateToObjective,
            saveAndEdit: saveAndEdit,
            saveAndCreate: saveAndCreate
        };
    }
);