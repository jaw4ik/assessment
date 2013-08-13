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
                downloadExperience: 'Download experience',
                experienceBuildFailed: 'Experience build is failed'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

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

            excludeEmptyObjectives = function (exp) {
                var dataRejected = _.clone(exp);
                dataRejected.objectives = _.reject(dataRejected.objectives, function (objective) {
                    return objective.questions.length == 0;
                });

                return dataRejected;
            },
            
            buildExperience = function (experience) {
                sendEvent(events.buildExperience);
                experience.showBuildingStatus(true);
                experience.buildingStatus(constants.buildingStatuses.inProgress);

                if (experience.isSelected())
                    experience.isSelected(false);

                var data = _.find(dataContext.experiences, function (item) {
                    return item.id == experience.id;
                });

                return http.post('experience/build', excludeEmptyObjectives(data))
                    .done(function (response) {
                        var buildingStatus = response.Success ? constants.buildingStatuses.succeed : constants.buildingStatuses.failed;
                        experience.buildingStatus(buildingStatus);
                    })
                    .fail(function () {
                        sendEvent(events.experienceBuildFailed);
                        experience.buildingStatus(constants.buildingStatuses.failed);
                    })
                    .always(function () {
                        setTimeout(function () {
                            experience.showBuildingStatus(false);
                        }, 10000);
                    });
            },

        downloadExperience = function (experience) {
            sendEvent(events.downloadExperience);
            router.navigateTo('download/' + experience.id + '.zip');
        },

        enableOpenExperience = function (experience) {
            experience.showBuildingStatus(false);
        },

        activate = function () {
            var sortedExperiences = _.sortBy(dataContext.experiences, function (experience) {
                return experience.title.toLowerCase();
            });

            sortedExperiences = currentSortingOption() == constants.sortingOptions.byTitleAsc ? sortedExperiences : sortedExperiences.reverse();

            experiences(ko.utils.arrayMap(sortedExperiences, function (item) {
                var experience = {};

                experience.id = item.id;
                experience.title = item.title;
                experience.objectives = item.objectives;

                experience.buildingStatus = ko.observable(item.buildingStatus);
                experience.buildingStatus.subscribe(function (newValue) {
                    item.buildingStatus = newValue;
                });
                experience.showBuildingStatus = ko.observable(item.showBuildingStatus);
                experience.showBuildingStatus.subscribe(function (newValue) {
                    item.showBuildingStatus = newValue;
                });

                experience.isSelected = ko.observable(false);

                return experience;
            }));

            enableSorting(experiences().length > 1);
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

            activate: activate
        };
    }
);