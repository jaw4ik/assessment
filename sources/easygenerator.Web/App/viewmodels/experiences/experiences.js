define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router'],
    function (dataContext, constants, eventTracker, router) {
        "use strict";
        
        var
            experiences = ko.observableArray([]),
            
            currentSortingOption = ko.observable(),

            sortByTitleAsc = function () {
                if (currentSortingOption() == constants.sortingOptions.byTitleAsc)
                    return;
                
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                experiences(_.sortBy(experiences(), function (experience) { return experience.title.toLowerCase(); }));
                eventTracker.publish(constants.events.publicationsSortedByTitleAsc);
            },
            
            sortByTitleDesc = function () {
                if (currentSortingOption() == constants.sortingOptions.byTitleDesc)
                    return;

                currentSortingOption(constants.sortingOptions.byTitleDesc);
                experiences(_.sortBy(experiences(), function (experience) { return experience.title.toLowerCase(); }).reverse());
                eventTracker.publish(constants.events.publicationsSortedByTitleDesc);
            },
            
            activate = function () {
                return Q.fcall(function () {                  
                    experiences(ko.utils.arrayMap(dataContext.experiences, function (item) {
                        return { id: item.id, title: item.title, objectives: item.objectives };
                    }));
                    sortByTitleAsc();
                });
            },
            
            goToObjectives = function () {
                router.navigateTo('#/objectives');
                eventTracker.publish(constants.events.navigateToObjectives);
            };

        return {
            activate: activate,
            experiences: experiences,
            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,
            goToObjectives: goToObjectives
        };
    }
);