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
                experiencePublishFailed: 'Experience publish is failed',
                publishExperience: 'Publish experience',
                deleteExperiences: "Delete selected experiences"
            },

            storage = [];


        var viewModel = {
            experiences: ko.observableArray([]),
            toggleSelection: toggleSelection,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToObjectives: navigateToObjectives,

            statuses: constants.statuses,
            buildExperience: buildExperience,
            downloadExperience: downloadExperience,
            enableOpenExperience: enableOpenExperience,
            
            publishExperience: publishExperience,

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

            if (experience.isSelected()) {
                experience.isSelected(false);
            }

            experienceService.build(experience.id).fail(function (reason) {
                notify.error(reason);
                eventTracker.publish(events.experienceBuildFailed);
            });
        }

        function publishExperience(experience) {
            if (!experience.isFirstBuild()) {
                eventTracker.publish(events.publishExperience);

                if (experience.isSelected()) {
                    experience.isSelected(false);
                }

                experienceService.publish(experience.id).fail(function(reason) {
                    notify.error(reason);
                    eventTracker.publish(events.experiencePublishFailed);
                });
            }
        }
        
        function downloadExperience(experience) {
            if (!experience.isFirstBuild()) {
                eventTracker.publish(events.downloadExperience);
                router.download('download/' + experience.packageUrl());
            }
        }

        function enableOpenExperience(experience) {
            if (experience.buildingStatus() !== constants.statuses.inProgress && experience.publishingState() !== constants.statuses.inProgress) {
                experience.showStatus(false);
            }
            if (experience.buildingStatus() === constants.statuses.failed) {
                experience.buildingStatus(constants.statuses.notStarted);
                experience.publishingState(constants.statuses.notStarted);
            }
            if (experience.publishingState() === constants.statuses.failed) {
                experience.publishingState(constants.statuses.notStarted);
            }
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
                experience.publishingState = ko.observable(item.publishingState);
                experience.packageUrl = ko.observable(item.packageUrl);
                experience.publishedPackageUrl = ko.observable(item.publishedPackageUrl);
                experience.modifiedOn = item.modifiedOn;

                experience.isFirstBuild = ko.computed(function () {
                    return _.isNullOrUndefined(this.packageUrl()) || _.isEmptyOrWhitespace(this.packageUrl());
                }, experience);
                
                experience.isFirstPublish = ko.computed(function () {
                    return _.isNullOrUndefined(this.publishedPackageUrl()) || _.isEmptyOrWhitespace(this.publishedPackageUrl());
                }, experience);

                experience.isSelected = ko.observable(false);
                experience.showStatus = ko.observable();

                var storageItem = storage[item.id] || { showStatus: false, buildingStatus: constants.statuses.notStarted, publishingState: constants.statuses.notStarted };
                var showStatus = storageItem.showStatus || (item.buildingStatus == constants.statuses.inProgress
                    || item.buildingStatus != storageItem.buildingStatus) || (item.publishingState == constants.statuses.inProgress || item.publishingState != storageItem.publishingState);
                
                experience.showCreatingStatus = ko.computed(function () {
                    return (this.isFirstBuild() && this.buildingStatus() == constants.statuses.inProgress) || (this.isFirstPublish() && this.publishingState() == constants.statuses.inProgress);
                }, experience);
                
                experience.showStatus(showStatus);
                
                experience.showCompleteStatus = ko.computed(function () {
                    return (this.buildingStatus() == constants.statuses.succeed && this.publishingState() != constants.statuses.inProgress && this.publishingState() != constants.statuses.failed) ||
                        (this.publishingState() == constants.statuses.succeed && this.buildingStatus() != constants.statuses.inProgress && this.buildingStatus() != constants.statuses.failed);
                }, experience);
                
                experience.showFailedStatus = ko.computed(function () {
                    return (this.buildingStatus() == constants.statuses.failed && this.publishingState() != constants.statuses.inProgress) ||
                        (this.publishingState() == constants.statuses.failed && this.buildingStatus() != constants.statuses.inProgress);
                }, experience);
                
                return experience;
            }));
        }

        function deactivate() {
            storage = [];
            _.each(viewModel.experiences(), function (item) {
                storage[item.id] = {
                    showStatus: item.showStatus(),
                    buildingStatus: item.buildingStatus(),
                    publishingState: item.publishingState()
                };
            });
        };

        //#region App-wide messaging

        app.on(constants.messages.experience.build.started).then(function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.buildingStatus(constants.statuses.inProgress);
                expVm.showStatus(true);
            });
        });

        app.on(constants.messages.experience.build.completed, function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.buildingStatus(constants.statuses.succeed);
                expVm.packageUrl(experience.packageUrl);
            });
        });

        app.on(constants.messages.experience.build.failed, function (experienceId) {
            updateExperienceViewModelIfExists(experienceId, function (expVm) {
                expVm.buildingStatus(constants.statuses.failed);
                expVm.packageUrl("");
            });
        });
        
        // #region publish events
        app.on(constants.messages.experience.publish.started).then(function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.publishingState(constants.statuses.inProgress);
                expVm.showStatus(true);
            });
        });

        app.on(constants.messages.experience.publish.completed, function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.publishingState(constants.statuses.succeed);
                expVm.publishedPackageUrl(experience.publishedPackageUrl);
            });
        });

        app.on(constants.messages.experience.publish.failed, function (experienceId) {
            updateExperienceViewModelIfExists(experienceId, function (expVm) {
                expVm.publishingState(constants.statuses.failed);
                expVm.publishedPackageUrl("");
            });
        });
        // #endregion publish events
        
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