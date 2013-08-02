define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router', 'durandal/http'],
    function (dataContext, constants, eventTracker, router, http) {
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
                downloadExperience: 'Download experience'
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

        buildExperience = function (experience) {
            sendEvent(events.buildExperience);
            experience.isBuilding(true);

            if (experience.isBuildFinished())
                experience.isBuildFinished(false);

            if (experience.isBuildSucceed())
                experience.isBuildSucceed(false);

            if (experience.isSelected())
                experience.isSelected(false);

            var data = _.find(dataContext.experiences, function(item) {
                return item.id == experience.id;
            });

            return http.post('experience/build', data)
                .done(function (response) {
                    experience.isBuildFinished(true);
                    experience.isBuildSucceed(response.Success);
                })
                .always(function () {
                    experience.isBuilding(false);
                });
        },

        downloadExperience = function (experience) {
            sendEvent(events.downloadExperience);
            router.navigateTo('download/' + experience.id + '.zip');
        },

        activate = function () {
            var sortedExperiences = _.sortBy(dataContext.experiences, function (experience) { return experience.title.toLowerCase(); });
            currentSortingOption(constants.sortingOptions.byTitleAsc);

            experiences(ko.utils.arrayMap(sortedExperiences, function (item) {
                return {
                    id: item.id,
                    title: item.title,
                    objectives: item.objectives,
                    isSelected: ko.observable(false),
                    isBuilding: ko.observable(false),
                    isBuildFinished: ko.observable(false),
                    isBuildSucceed: ko.observable(false)
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

            buildExperience: buildExperience,
            downloadExperience: downloadExperience,

            activate: activate
        };
    }
);