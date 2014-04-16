﻿define(['constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/courseRepository', 'notify', 'localization/localizationManager', 'clientContext'],
    function (constants, eventTracker, router, objectiveRepository, courseRepository, notify, localizationManager, clientContext) {
        "use strict";

        var
            events = {
                navigateToCreation: "Navigate to create objective",
                navigateToDetails: "Navigate to objective details",
                navigateToCourses: "Navigate to courses",
                selectObjective: "Select Objective",
                unselectObjective: "Unselect Objective",
                deleteObjectives: "Delete selected objectives"
            };

        var
            objectives = ko.observableArray([]),
            lastVisitedObjective = '',
            currentLanguage = '',

            //#region Navigation

            navigateToCreation = function () {
                eventTracker.publish(events.navigateToCreation);
                router.navigate('objective/create');
            },

            navigateToDetails = function (item) {
                eventTracker.publish(events.navigateToDetails);
                router.navigate('objective/' + item.id);
            },

            navigateToCourses = function () {
                eventTracker.publish(events.navigateToCourses);
                router.navigate('courses');
            },

            //#endregion Navigation

            //#region Delete objective

            getSelectedObjectives = function () {
                return _.reject(objectives(), function (objective) {
                    return objective.isSelected && !objective.isSelected();
                });
            },

            enableDeleteObjectives = ko.computed(function () {
                return getSelectedObjectives().length > 0;
            }),

            deleteSelectedObjectives = function () {
                eventTracker.publish(events.deleteObjectives);

                var selectedObjectives = getSelectedObjectives();
                if (selectedObjectives.length == 0) {
                    throw "No selected objectives to delete";
                }

                if (selectedObjectives.length > 1) {
                    notify.error(localizationManager.localize('deleteSeveralObjectivesError'));
                    return undefined;
                }

                var selectedObjective = selectedObjectives[0];

                if (!selectedObjective.canBeDeleted) {
                    notify.error(localizationManager.localize('objectiveCannnotBeDeleted'));
                    return undefined;
                }

                objectiveRepository.removeObjective(selectedObjective.id).then(function () {
                    objectives(_.reject(objectives(), function (objective) {
                        return objective.id === selectedObjective.id;
                    }));
                    notify.saved();
                });
            },

            //#endregion Delete objective

            //#region Objective selection

            toggleObjectiveSelection = function (objective) {

                if (_.isNullOrUndefined(objective)) {
                    throw 'Objective is null or undefined';
                }

                if (!ko.isObservable(objective.isSelected)) {
                    throw 'Objective does not have isSelected observable';
                }

                objective.isSelected(!objective.isSelected());
                eventTracker.publish(objective.isSelected() ? events.selectObjective : events.unselectObjective);
            },

            //#endregion Objective selection

             activate = function () {

                 this.lastVisitedObjective = clientContext.get('lastVisitedObjective');
                 clientContext.set('lastVisitedObjective', null);
                 this.currentLanguage = localizationManager.currentLanguage;

                 return objectiveRepository.getCollection().then(function (receivedObjectives) {
                     return courseRepository.getCollection().then(function (courses) {
                         var includedObjectives = _.chain(courses).map(function (course) {
                             return course.objectives;
                         }).flatten().uniq().value();

                         var array = _.chain(receivedObjectives)
                             .sortBy(function (item) { return -item.createdOn; })
                             .map(function (item) {
                                 return {
                                     id: item.id,
                                     title: item.title,
                                     image: item.image,
                                     questionsCount: item.questions.length,
                                     modifiedOn: item.modifiedOn,
                                     isSelected: ko.observable(false),
                                     canBeDeleted: (function (currentItem) {
                                         if (item.questions.length > 0)
                                             return false;

                                         return (!_.find(includedObjectives, function (objective) {
                                             return objective.id === currentItem.id;
                                         }));
                                     })(item)
                                 };
                             }).value();

                         objectives(array);
                     });
                 });
             };

        return {
            objectives: objectives,
            currentLanguage: currentLanguage,
            
            toggleObjectiveSelection: toggleObjectiveSelection,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToCourses: navigateToCourses,

            enableDeleteObjectives: enableDeleteObjectives,
            deleteSelectedObjectives: deleteSelectedObjectives,
            lastVisitedObjective: lastVisitedObjective,

            activate: activate
        };
    });