﻿define(['dataContext', 'constants', 'eventTracker'],
    function (dataContext, constants, eventTracker) {
        "use strict";
        
        var
            publications = ko.observableArray([]),
            
            currentSortingOption = ko.observable(),

            sortByTitleAsc = function () {
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                publications(_.sortBy(publications(), function (publication) { return publication.title.toLowerCase(); }));
                eventTracker.publish(constants.events.publicationsSortedByTitleAsc);
            },
            
            sortByTitleDesc = function () {
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                publications(_.sortBy(publications(), function (publication) { return publication.title.toLowerCase(); }).reverse());
                eventTracker.publish(constants.events.publicationsSortedByTitleDesc);
            },
            
            activate = function () {
                return Q.fcall(function () {                  
                    publications(ko.utils.arrayMap(dataContext.publications, function(item) {
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
            publications: publications,
            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,
            goToObjectives: goToObjectives
        };
    }
);