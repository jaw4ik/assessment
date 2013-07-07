define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router'],
    function (dataContext, constants, eventTracker, router) {
        "use strict";

        var
            events = {
                category: 'Objectives',
                navigateToDetails: "Navigate to objective details",
                navigateToExperiences: "Navigate to experiences",
                sortByTitleAsc: "Sort by title ascending",
                sortByTitleDesc: "Sort by title descending",
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
                objectives(_.sortBy(objectives(), function (objective) { return objective.title; }));
            },
            sortByTitleDesc = function () {
                sendEvent(events.sortByTitleDesc);
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                objectives(_.sortBy(objectives(), function (objective) { return objective.title; }).reverse());
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
                var array = _.chain(dataContext.objectives)
                                .map(function (item) {
                                    return {
                                        id: item.id,
                                        title: item.title,
                                        image: item.image,
                                        questionsCount:item.questions.length,
                                        isSelected: ko.observable(false),
                                        toggleSelection: function () {
                                            this.isSelected(!this.isSelected());
                                        }
                                    };
                                })
                                .sortBy(function (objective) { return objective.title; })
                                .value();
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                objectives(array);
            };

        return {
            objectives: objectives,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,

            navigateToDetails: navigateToDetails,
            navigateToExperiences: navigateToExperiences,

            activate: activate
        };
    }
);