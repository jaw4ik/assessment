﻿define(['durandal/app', 'dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/experienceRepository', 'services/buildExperience', 'notify', 'localization/localizationManager', 'clientContext'],
    function (app, dataContext, constants, eventTracker, router, experienceRepository, experienceService, notify, localizationManager, clientContext) {
        "use strict";

        var
            events = {
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
                eventTracker.publish(eventName);
            },

            storage = [];


        var viewModel = {
            experiences: ko.observableArray([]),
            toggleSelection: toggleSelection,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: ko.observable(constants.sortingOptions.byTitleAsc),
            sortingOptions: constants.sortingOptions,
            enableSorting: ko.observable(true),

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToObjectives: navigateToObjectives,

            buildingStatuses: constants.buildingStatuses,
            buildExperience: buildExperience,
            downloadExperience: downloadExperience,
            enableOpenExperience: enableOpenExperience,
            resetBuildStatus: resetBuildStatus,

            deleteSelectedExperiences: deleteSelectedExperiences,
            lastVistedExperienceId: '',
            currentLanguage: '',

            activate: activate,
            deactivate: deactivate
        };


        function toggleSelection(experience) {
            if (!experience.isSelected())
                sendEvent(events.experienceSelected);
            else
                sendEvent(events.experienceUnselected);

            experience.isSelected(!experience.isSelected());
        }

        function sortByTitleAsc() {
            if (viewModel.currentSortingOption() == constants.sortingOptions.byTitleAsc)
                return;

            sendEvent(events.sortByTitleAsc);
            viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);
            viewModel.experiences(_.sortBy(viewModel.experiences(), function (experience) { return experience.title.toLowerCase(); }));
        }

        function sortByTitleDesc() {
            if (viewModel.currentSortingOption() == constants.sortingOptions.byTitleDesc)
                return;

            sendEvent(events.sortByTitleDesc);
            viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);
            viewModel.experiences(_.sortBy(viewModel.experiences(), function (experience) { return experience.title.toLowerCase(); }).reverse());
        }

        function navigateToCreation() {
            sendEvent(events.navigateToCreateExperience);
            router.navigate('experience/create');
        }


        function navigateToDetails(experience) {
            sendEvent(events.navigateToDetails);
            router.navigate('experience/' + experience.id);
        }

        function navigateToObjectives() {
            sendEvent(events.navigateToObjectives);
            router.navigate('objectives');
        }


        function buildExperience(experience) {
            sendEvent(events.buildExperience);

            if (experience.isSelected())
                experience.isSelected(false);

            experienceService.build(experience.id).fail(function () {
                sendEvent(events.experienceBuildFailed);
            });
        }

        function downloadExperience(experience) {
            sendEvent(events.downloadExperience);
            router.download('download/' + experience.packageUrl());
        }


        function resetBuildStatus(experience) {
            experience.buildingStatus(constants.buildingStatuses.notStarted);
        }

        function enableOpenExperience(experience) {
            experience.showBuildingStatus(false);
        }

        function getSelectedExperiences() {
            return _.filter(viewModel.experiences(), function (experience) {
                return experience.isSelected && experience.isSelected();
            });
        }

        viewModel.canDeleteExperiences = ko.computed(function () {
            return getSelectedExperiences().length == 1;
        });

        function deleteSelectedExperiences() {
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
                viewModel.experiences(_.without(viewModel.experiences(), selectedExperience));
            });
        }

        function activate() {
            var sortedExperiences = _.sortBy(dataContext.experiences, function (experience) {
                return experience.title.toLowerCase();
            });

            viewModel.lastVistedExperienceId = clientContext.get('lastVistedExperience');
            viewModel.currentLanguage = localizationManager.currentLanguage;

            clientContext.set('lastVistedExperience', null);

            sortedExperiences = viewModel.currentSortingOption() == constants.sortingOptions.byTitleAsc ? sortedExperiences : sortedExperiences.reverse();

            viewModel.experiences(_.map(sortedExperiences, function (item) {
                var experience = {};

                experience.id = item.id;
                experience.title = item.title;
                experience.image = item.template.image;
                experience.objectives = item.objectives;
                experience.buildingStatus = ko.observable(item.buildingStatus);
                experience.packageUrl = ko.observable(item.packageUrl);
                experience.modifiedOn = item.modifiedOn;

                experience.isFirstBuild = ko.computed(function () {
                    return _.isNullOrUndefined(this.packageUrl()) || _.isEmptyOrWhitespace(this.packageUrl());
                }, experience);

                experience.isSelected = ko.observable(false);
                experience.showBuildingStatus = ko.observable();

                var storageItem = storage[item.id] || { showBuildingStatus: false, buildingStatus: constants.buildingStatuses.notStarted };
                var showBuildingStatus = storageItem.showBuildingStatus
                    || item.buildingStatus == constants.buildingStatuses.inProgress
                    || item.buildingStatus != storageItem.buildingStatus;

                experience.showBuildingStatus(showBuildingStatus);
                return experience;
            }));

            viewModel.enableSorting(viewModel.experiences().length > 1);
        }

        function deactivate() {
            storage = [];
            _.each(viewModel.experiences(), function (item) {
                storage[item.id] = {
                    showBuildingStatus: item.showBuildingStatus(),
                    buildingStatus: item.buildingStatus()
                };
            });
        };

        app.on(constants.messages.experience.build.started).then(function (experience) {
            var expVm = _.find(viewModel.experiences(), function (item) {
                return item.id == experience.id;
            });

            if (_.isObject(expVm)) {
                expVm.buildingStatus(constants.statuses.inProgress);
                expVm.showBuildingStatus(true);
            }
        });

        app.on(constants.messages.experience.build.finished, function (experience) {
            var expVm = _.find(viewModel.experiences(), function (item) {
                return item.id == experience.id;
            });

            if (_.isObject(expVm)) {
                expVm.buildingStatus(experience.buildingStatus);
                expVm.packageUrl(experience.packageUrl);
            }
        });

        return viewModel;
    }
);