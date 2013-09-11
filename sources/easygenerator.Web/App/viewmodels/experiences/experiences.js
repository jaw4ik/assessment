define(['dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/experienceRepository', 'services/buildExperience', 'notify', 'localization/localizationManager'],
    function (dataContext, constants, eventTracker, router, experienceRepository, experienceService, notify, localizationManager) {
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
                experienceBuildFailed: 'Experience build is failed',
                deleteExperiences: "Delete selected experiences"
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
                router.navigate('experience/create');
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
                    .then(function (response) {
                        if (response.Success) {
                            experience.buildingStatus(constants.buildingStatuses.succeed);
                        }
                        else {
                            sendEvent(events.experienceBuildFailed);
                            experience.buildingStatus(constants.buildingStatuses.failed);
                        }
                        experience.packageUrl = response.PackageUrl;
                        var experienceFromDataContext = _.find(dataContext.experiences, function (item) {
                            return item.id == experience.id;
                        });

                        experienceFromDataContext.packageUrl = response.PackageUrl;
                        experienceFromDataContext.builtOn = new Date();
                    });
            },

            downloadExperience = function (experience) {
                sendEvent(events.downloadExperience);
                router.download('download/' + experience.packageUrl);
            },

            enableOpenExperience = function (experience) {
                experience.showBuildingStatus(false);
            },

            getSelectedExperiences = function () {
                return _.filter(experiences(), function (experience) {
                    return experience.isSelected && experience.isSelected();
                });
            },
            canDeleteExperiences = ko.computed(function () {
                return getSelectedExperiences().length == 1;
            }),

            deleteSelectedExperiences = function () {
                sendEvent(events.deleteExperiences);

                var selectedExperiences = getSelectedExperiences();
                if (selectedExperiences.length == 0) {
                    throw 'There are no experiences selected';
                }
                if (selectedExperiences.length > 1) {
                    throw 'You can not delete more than 1 experience at once';
                }

                var selectedExperience = selectedExperiences[0];
                if (selectedExperience.objectives.length > 0) {
                    notify.error(localizationManager.localize('experienceCannotBeDeleted'));
                    return;
                }

                notify.hide();

                experienceRepository.removeExperience(selectedExperience.id).then(function () {
                    experiences(_.without(experiences(), selectedExperience));
                });
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
                    experience.packageUrl = item.packageUrl;

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

            canDeleteExperiences: canDeleteExperiences,
            deleteSelectedExperiences: deleteSelectedExperiences,

            activate: activate,
            deactivate: deactivate
        };
    }
);