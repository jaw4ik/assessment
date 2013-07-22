﻿define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router', 'repositories/objectiveBriefRepository'],
    function (dataContext, constants, eventTracker, router, repository) {
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
            },
            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var
            objectives = ko.observableArray([]),

            currentSortingOption = ko.observable(),

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
                //return repository.activate().then(function () {
                    currentSortingOption(constants.sortingOptions.byTitleAsc);
                    objectives(_.chain(dataContext.objectives)
                                .map(function (item) {
                                    return {
                                        id: item.id,
                                        title: item.title,
                                        image: item.image,
                                        questionsCount: item.questions.length,
                                        isSelected: ko.observable(false),
                                        toggleSelection: function () {
                                            sendEvent(events.selectObjective);
                                            this.isSelected(!this.isSelected());
                                        }
                                    };
                                })
                                .sortBy(function (objective) { return objective.title.toLowerCase(); })
                                .value());
                //});
            };

        return {
            objectives: objectives,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToExperiences: navigateToExperiences,

            activate: activate
        };
    }
);