define(['constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/experienceRepository', 'notify', 'localization/localizationManager', 'clientContext'],
    function (constants, eventTracker, router, objectiveRepository, experienceRepository, notify, localizationManager, clientContext) {
        "use strict";

        var
            events = {
                navigateToCreation: "Navigate to Objective creation",
                navigateToDetails: "Navigate to Objective details",
                navigateToExperiences: "Navigate to Experiences",
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

            navigateToExperiences = function () {
                eventTracker.publish(events.navigateToExperiences);
                router.navigate('experiences');
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
                     experienceRepository.getCollection().then(function (experiences) {
                         var includedObjectives = _.chain(experiences).map(function (experience) {
                             return experience.objectives;
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

                                         if (_.find(includedObjectives, function (objective) {
                                             return objective.id === currentItem.id;
                                         })) return false;

                                         return true;
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
            navigateToExperiences: navigateToExperiences,

            enableDeleteObjectives: enableDeleteObjectives,
            deleteSelectedObjectives: deleteSelectedObjectives,
            lastVisitedObjective: lastVisitedObjective,

            activate: activate
        };
    });