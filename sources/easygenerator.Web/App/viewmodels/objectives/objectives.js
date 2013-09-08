define(['constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/experienceRepository', 'notify', 'localization/localizationManager'],
    function (constants, eventTracker, router, objectiveRepository, experienceRepository, notify, localizationManager) {
        "use strict";

        var events = {
            category: 'Objectives',
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
                eventTracker.publish(eventName, events.category);
            };

        var objectives = ko.observableArray([]),
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
            canDeleteObjectives = ko.computed(function () {
                return getSelectedObjectives().length == 1;
            }),
            deleteSelectedObjectives = function () {
                sendEvent(events.deleteObjectives);

                var selectedObjectives = getSelectedObjectives();
                if (selectedObjectives.length == 0)
                    throw "No selected objectives to delete";
                if (selectedObjectives.length > 1)
                    throw "Too many elements to remove";

                var selectedObjective = selectedObjectives[0];

                if (!selectedObjective.canBeDeleted) {
                    notify.error(localizationManager.localize('objectiveCannnotBeDeleted'));
                    return undefined;
                } else {
                    notify.hide();
                }

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

            toggleObjectiveSelection: toggleObjectiveSelection,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToExperiences: navigateToExperiences,

            canDeleteObjectives: canDeleteObjectives,
            deleteSelectedObjectives: deleteSelectedObjectives,

            activate: activate
        };
    });