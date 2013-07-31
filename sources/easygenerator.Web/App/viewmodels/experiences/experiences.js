﻿define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router'],
    function (dataContext, constants, eventTracker, router) {
        "use strict";

        var
            events = {
                category: 'Experiences',
                navigateToObjectives: 'Navigate to objectives',
                sortByTitleAsc: 'Sort by title ascending',
                sortByTitleDesc: 'Sort by title descending',
                navigateToCreateExperience: 'Navigate to create experience',
                experienceSelected: 'Experience selected',
                experienceUnselected: 'Experience unselected',
                navigateToDetails: 'Navigate to details',
                buildExperience: 'Build experience',
                downloadExperience: 'Download experience',
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var
            experiences = ko.observableArray([]),

            toggleSelection = function (experience) {
                if (!experience.isSelected())
                    sendEvent(events.experienceSelected);
                else
                    sendEvent(events.experienceUnselected);

                experience.isSelected(!experience.isSelected());
            },

            currentSortingOption = ko.observable(),

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

            navigateToCreation = function () {
                sendEvent(events.navigateToCreateExperience);
                router.navigateTo('#/404');
            },

            navigateToDetails = function (experience) {
                sendEvent(events.navigateToDetails);
                router.navigateTo('#/experience/' + experience.id);
            },

             navigateToObjectives = function () {
                 sendEvent(events.navigateToObjectives);
                 router.navigateTo('#/objectives');
             },

//TODO: temporary method for testing markUp. Should be deleted or modifying then backend will be implemented.

        buildExperience = function (experience) {

            sendEvent(events.buildExperience);
            if (experience.isBuilded())
                experience.isBuilded(false);

            experience.building(true);
            experience.isSelected(false);

            setTimeout(function () {
                experience.building(false);
                experience.isBuilded(true);
                var trying = Math.floor(Math.random() * 2 + 1);
                if (trying == 1) {
                    experience.buildFinished(false);
                } else {
                    experience.buildFinished(true);
                }
            }, 2000);
        },

        downloadExperience = function () {
            sendEvent(events.downloadExperience);
            alert('download not implemented yet');
        },
//TODO:END of temporary code
        activate = function () {
            var sortedExperiences = _.sortBy(dataContext.experiences, function (experience) { return experience.title.toLowerCase(); });
            currentSortingOption(constants.sortingOptions.byTitleAsc);

            experiences(ko.utils.arrayMap(sortedExperiences, function (item) {
                return {
                    id: item.id,
                    title: item.title,
                    objectives: item.objectives,
                    isSelected: ko.observable(false),
                    building: ko.observable(false),
                    isBuilded: ko.observable(false),
                    buildFinished: ko.observable(false)
                };
            }));
        };

        return {
            experiences: experiences,
            toggleSelection: toggleSelection,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToObjectives: navigateToObjectives,

            activate: activate,
            //TODO: delete or modify this string!
            buildExperience: buildExperience,
            downloadExperience: downloadExperience
        };
    }
);