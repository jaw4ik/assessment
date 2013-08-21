define(['dataContext', 'constants', 'eventTracker', 'plugins/router', 'services/buildExperience'],
    function (dataContext, constants, eventTracker, router, experienceService) {
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
                experienceBuildFailed: 'Experience build is failed'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            },

            storage = [];

        var
            experiences = ko.observableArray([]),

            enableSorting = ko.observable(true),

            toggleSelection = function (experience) {
                if (!experience.isSelected())
                    sendEvent(events.experienceSelected);
                else
                    sendEvent(events.experienceUnselected);

                experience.isSelected(!experience.isSelected());
            },

            currentSortingOption = ko.observable(constants.sortingOptions.byTitleAsc),

            sortByTitleAsc = function () {
                if (currentSortingOption() == constants.sortingOptions.byTitleAsc)
                    return;

                sendEvent(events.sortByTitleAsc);
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                experiences(_.sortBy(experiences(), function (experience) { return experience.title.toLowerCase(); }));
            },

            sortByTitleDesc = function () {
                if (currentSortingOption() == constants.sortingOptions.byTitleDesc)
                    return;

                sendEvent(events.sortByTitleDesc);
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                experiences(_.sortBy(experiences(), function (experience) { return experience.title.toLowerCase(); }).reverse());
            },

            navigateToCreation = function () {
                sendEvent(events.navigateToCreateExperience);
                router.navigate('404');
            },

            navigateToDetails = function (experience) {
                sendEvent(events.navigateToDetails);
                router.navigate('experience/' + experience.id);
            },

            navigateToObjectives = function () {
                sendEvent(events.navigateToObjectives);
                router.navigate('objectives');
            },

            buildExperience = function (experience) {
                sendEvent(events.buildExperience);
                experience.showBuildingStatus(true);
                experience.buildingStatus(constants.buildingStatuses.inProgress);

                if (experience.isSelected())
                    experience.isSelected(false);

                experienceService.build(experience.id)
                    .then(function (success) {
                        if (success) {
                            experience.buildingStatus(constants.buildingStatuses.succeed);
                        }
                        else {
                            sendEvent(events.experienceBuildFailed);
                            experience.buildingStatus(constants.buildingStatuses.failed);
                        }
                    });
            },

            downloadExperience = function (experience) {
                sendEvent(events.downloadExperience);
                var downloadUrl = window.location.href.replace(window.location.hash, 'download/' + experience.id + '.zip');
                window.location.assign(downloadUrl);
            },

            enableOpenExperience = function (experience) {
                experience.showBuildingStatus(false);
            },

            activate = function () {
                var sortedExperiences = _.sortBy(dataContext.experiences, function (experience) {
                    return experience.title.toLowerCase();
                });

                sortedExperiences = currentSortingOption() == constants.sortingOptions.byTitleAsc ? sortedExperiences : sortedExperiences.reverse();

                experiences(_.map(sortedExperiences, function (item) {
                    var experience = {};

                    experience.id = item.id;
                    experience.title = item.title;
                    experience.objectives = item.objectives;
                    experience.buildingStatus = ko.observable(item.buildingStatus);

                    experience.isSelected = ko.observable(false);
                    experience.showBuildingStatus = ko.observable();

                    var storageItem = storage[item.id] || { showBuildingStatus: false, buildingStatus: constants.buildingStatuses.notStarted };
                    var showBuildingStatus = storageItem.showBuildingStatus
                        || item.buildingStatus == constants.buildingStatuses.inProgress
                        || item.buildingStatus != storageItem.buildingStatus;

                    experience.showBuildingStatus(showBuildingStatus);

                    return experience;
                }));

                enableSorting(experiences().length > 1);
            },

            deactivate = function () {
                storage = [];
                _.each(experiences(), function (item) {
                    storage[item.id] = {
                        showBuildingStatus: item.showBuildingStatus(),
                        buildingStatus: item.buildingStatus()
                    };
                });
            };

        return {
            experiences: experiences,
            toggleSelection: toggleSelection,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,
            enableSorting: enableSorting,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToObjectives: navigateToObjectives,

            buildingStatuses: constants.buildingStatuses,
            buildExperience: buildExperience,
            downloadExperience: downloadExperience,
            enableOpenExperience: enableOpenExperience,

            activate: activate,
            deactivate: deactivate
        };
    }
);