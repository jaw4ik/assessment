define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router'],
    function (dataContext, constants, eventTracker, router) {
        "use strict";

        var
            events = {
                category: 'Experiences',
                navigateToObjectives: "Navigate to objectives",
                sortByTitleAsc: "Sort by title ascending",
                sortByTitleDesc: "Sort by title descending"
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var
            experiences = ko.observableArray([]),
            currentSortingOption = ko.observable(),

            activate = function () {
                return Q.fcall(function () {
                    experiences(ko.utils.arrayMap(dataContext.experiences, function (item) {
                        return { id: item.id, title: item.title, objectives: item.objectives };
                    }));
                    sortByTitleAsc();
                });
            },

            sortByTitleAsc = function () {
                if (currentSortingOption() == constants.sortingOptions.byTitleAsc)
                    return;

                currentSortingOption(constants.sortingOptions.byTitleAsc);
                experiences(_.sortBy(experiences(), function (experience) { return experience.title.toLowerCase(); }));
                sendEvent(events.sortByTitleAsc);
            },

            sortByTitleDesc = function () {
                if (currentSortingOption() == constants.sortingOptions.byTitleDesc)
                    return;

                currentSortingOption(constants.sortingOptions.byTitleDesc);
                experiences(_.sortBy(experiences(), function (experience) { return experience.title.toLowerCase(); }).reverse());
                sendEvent(events.sortByTitleDesc);
            },

            goToObjectives = function () {
                router.navigateTo('#/objectives');
                sendEvent(events.navigateToObjectives);
            };

        return {
            experiences: experiences,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,
            activate: activate,
            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            goToObjectives: goToObjectives
        };
    }
);