﻿define(['constants', 'eventTracker', 'durandal/plugins/router', 'repositories/objectiveBriefRepository'],
    function (constants, eventTracker, router, repository) {
        "use strict";

        var
            events = {
                category: 'Objectives',
                navigateToCreation: "Navigate to Objective creation",
                navigateToDetails: "Navigate to Objective details",
                navigateToExperiences: "Navigate to Experiences",
                sortByTitleAsc: "Sort by title ascending",
                sortByTitleDesc: "Sort by title descending",
                selectObjective: "Select Objective",
                unselectObjective: "Unselect Objective"
            },
            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var
            objectives = ko.observableArray([]),

            currentSortingOption = ko.observable(),
            
            enableSorting = ko.observable(true),

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

            navigateToCreation = function () {
                sendEvent(events.navigateToCreation);
                router.navigateTo('#/404');
            },
            navigateToDetails = function (item) {
                sendEvent(events.navigateToDetails);
                router.navigateTo('#/objective/' + item.id);
            },
            navigateToExperiences = function () {
                sendEvent(events.navigateToExperiences);
                router.navigateTo('#/experiences');
            },


            activate = function () {
                return repository.getCollection().then(function (objectiveBriefCollection) {
                    currentSortingOption(constants.sortingOptions.byTitleAsc);
                    var array = _.chain(objectiveBriefCollection)
                        .map(function(item) {
                            return {
                                id: item.id,
                                title: item.title,
                                image: item.image,
                                questionsCount: item.questionsCount,
                                isSelected: ko.observable(false),
                                toggleSelection: function () {
                                    if (this.isSelected()) {
                                        sendEvent(events.unselectObjective);
                                    } else {
                                        sendEvent(events.selectObjective);
                                    }
                                    this.isSelected(!this.isSelected());
                                }
                            };
                        })
                        .sortBy(function(objective) { return objective.title.toLowerCase(); })
                        .value();
                    objectives(array);

                    enableSorting(objectives().length > 1);
                });
            };

        return {
            objectives: objectives,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,
            enableSorting: enableSorting,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToExperiences: navigateToExperiences,

            activate: activate
        };
    }
);