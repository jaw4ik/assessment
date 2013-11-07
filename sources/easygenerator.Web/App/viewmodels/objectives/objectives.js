define(['constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/experienceRepository', 'notify', 'localization/localizationManager', 'clientContext'],
    function (constants, eventTracker, router, objectiveRepository, experienceRepository, notify, localizationManager, clientContext) {
        "use strict";

        var events = {
            navigateToCreation: "Navigate to Objective creation",
            navigateToDetails: "Navigate to Objective details",
            navigateToExperiences: "Navigate to Experiences",
            sortByTitleAsc: "Sort by title ascending",
            sortByTitleDesc: "Sort by title descending",
            selectObjective: "Select Objective",
            unselectObjective: "Unselect Objective",
            deleteObjectives: "Delete selected objectives"
        },
            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var objectives = ko.observableArray([]),
            lastVisitedObjective = '',
            currentLanguage = '',
            //#region Sorting

            currentSortingOption = ko.observable(constants.sortingOptions.byTitleAsc),
            sortByTitleAsc = function () {
                sendEvent(events.sortByTitleAsc);
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                objectives(_.sortBy(objectives(), function (objective) { return objective.title.toLowerCase(); }));
            },
            sortByTitleDesc = function () {
                sendEvent(events.sortByTitleDesc);
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                objectives(_.sortBy(objectives(), function (objective) { return objective.title.toLowerCase(); }).reverse());
            },
            //#endregion Sorting

            //#region Navigation

            navigateToCreation = function () {
                sendEvent(events.navigateToCreation);
                router.navigate('objective/create');
            },
            navigateToDetails = function (item) {
                sendEvent(events.navigateToDetails);
                router.navigate('objective/' + item.id);
            },
            navigateToExperiences = function () {
                sendEvent(events.navigateToExperiences);
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
                sendEvent(events.deleteObjectives);

                var selectedObjectives = getSelectedObjectives();
                if (selectedObjectives.length == 0)
                    throw "No selected objectives to delete";

                if (selectedObjectives.length > 1){
                    notify.error(localizationManager.localize('deleteSeveralObjectivesError'));
                    return undefined;
                }

                var selectedObjective = selectedObjectives[0];

                if (!selectedObjective.canBeDeleted) {
                    notify.error(localizationManager.localize('objectiveCannnotBeDeleted'));
                    return undefined;
                } 

                notify.hide();
                
                objectiveRepository.removeObjective(selectedObjective.id).then(function () {
                    objectives(_.reject(objectives(), function (objective) {
                        return objective.id === selectedObjective.id;
                    }));
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
                sendEvent(objective.isSelected() ? events.selectObjective : events.unselectObjective);
            },

            //#endregion Objective selection

             activate = function () {

                 this.lastVisitedObjective = clientContext.get('lastVisitedObjective');
                 clientContext.set('lastVisitedObjective', null);
                 this.currentLanguage = localizationManager.currentLanguage;

                 return objectiveRepository.getCollection().then(function (objectiveBriefCollection) {

                     experienceRepository.getCollection().then(function (experiences) {
                         var includedObjectives = _.chain(experiences)
                             .map(function (experience) {
                                 return experience.objectives;
                             }).flatten().uniq().value();

                         var array = _.chain(objectiveBriefCollection)
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
                             })
                             .sortBy(function (objective) { return objective.title.toLowerCase(); })
                             .value();

                         objectives(currentSortingOption() == constants.sortingOptions.byTitleAsc ? array : array.reverse());
                     });

                 });
             };

        return {
            objectives: objectives,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,
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