define(['durandal/app', 'dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/experienceRepository', 'services/buildExperience', 'notify', 'localization/localizationManager', 'clientContext'],
    function (app, dataContext, constants, eventTracker, router, experienceRepository, experienceService, notify, localizationManager, clientContext) {
        "use strict";

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                navigateToCreateExperience: 'Navigate to create experience',
                experienceSelected: 'Experience selected',
                experienceUnselected: 'Experience unselected',
                navigateToDetails: 'Navigate to details',
                buildExperience: 'Build experience',
                downloadExperience: 'Download experience',
                experienceBuildFailed: 'Experience build is failed',
                deleteExperiences: "Delete selected experiences"
            },

            storage = [];

        var
            viewModel = {
                experiences: ko.observableArray([]),
                toggleSelection: toggleSelection,

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
                eventTracker.publish(events.experienceSelected);
            else
                eventTracker.publish(events.experienceUnselected);

            experience.isSelected(!experience.isSelected());
        }
        
        function navigateToCreation() {
            eventTracker.publish(events.navigateToCreateExperience);
            router.navigate('experience/create');
        }

        function navigateToDetails(experience) {
            eventTracker.publish(events.navigateToDetails);
            router.navigate('experience/' + experience.id);
        }

        function navigateToObjectives() {
            eventTracker.publish(events.navigateToObjectives);
            router.navigate('objectives');
        }


        function buildExperience(experience) {
            eventTracker.publish(events.buildExperience);

            if (experience.isSelected())
                experience.isSelected(false);

            experienceService.build(experience.id).fail(function (reason) {
                notify.error(reason);
                eventTracker.publish(events.experienceBuildFailed);
            });
        }

        function downloadExperience(experience) {
            eventTracker.publish(events.downloadExperience);
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

        viewModel.enableDeleteExperiences = ko.computed(function () {
            return getSelectedExperiences().length > 0;
        });

        function deleteSelectedExperiences() {
            eventTracker.publish(events.deleteExperiences);

            var selectedExperiences = getSelectedExperiences();
            if (selectedExperiences.length == 0) {
                throw 'There are no experiences selected';
            }
            if (selectedExperiences.length > 1) {
                notify.error(localizationManager.localize('deleteSeveralExperiencesError'));
                return;
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

        //#region App-wide messaging

        app.on(constants.messages.experience.build.started).then(function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.buildingStatus(constants.statuses.inProgress);
                expVm.showBuildingStatus(true);
            });
        });

        app.on(constants.messages.experience.build.completed, function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.buildingStatus(constants.buildingStatuses.succeed);
                expVm.packageUrl(experience.packageUrl);
            });
        });

        app.on(constants.messages.experience.build.failed, function (experienceId) {
            updateExperienceViewModelIfExists(experienceId, function (expVm) {
                expVm.buildingStatus(constants.buildingStatuses.failed);
                expVm.packageUrl("");
            });
        });

        function updateExperienceViewModelIfExists(experienceId, handler) {
            var expVm = _.find(viewModel.experiences(), function (item) {
                return item.id == experienceId;
            });

            if (_.isObject(expVm)) {
                handler(expVm);
            }
        }

        //#endregion App-wide messaging

        return viewModel;
    }
);