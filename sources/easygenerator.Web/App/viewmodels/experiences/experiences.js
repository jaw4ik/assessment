define(['durandal/app', 'dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/experienceRepository', 'services/deliverService', 'notify', 'localization/localizationManager', 'clientContext', 'dom'],
    function (app, dataContext, constants, eventTracker, router, experienceRepository, experienceService, notify, localizationManager, clientContext, dom) {
        "use strict";

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                navigateToCreateExperience: 'Navigate to create experience',
                experienceSelected: 'Experience selected',
                experienceUnselected: 'Experience unselected',
                navigateToDetails: 'Navigate to details',
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

            states: constants.deliveringStates,
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

        function publishExperience(exp) {
            notify.hide();
            eventTracker.publish(events.publishExperience);
            if (exp.isSelected()) {
                exp.isSelected(false);
            }
            
            return experienceRepository.getById(exp.id).then(function (experience) {
                return experience.publish();
            }).fail(function (reason) {
                notifyError(reason);
                eventTracker.publish(events.experiencePublishFailed);
            });
        }
        
        function downloadExperience(exp) {
            notify.hide();
            eventTracker.publish(events.downloadExperience);
            if (exp.isSelected()) {
                exp.isSelected(false);
            }

            return experienceRepository.getById(exp.id).then(function (experience) {
                return experience.build().then(function () {
                    dom.clickElementById('packageLink_' + exp.id);
                });
            }).fail(function (reason) {
                eventTracker.publish(events.experienceBuildFailed);
                notifyError(reason);
            });;
        }

        function enableOpenExperience(experience) {
            if (experience.deliveringState() !== constants.deliveringStates.building && experience.deliveringState() !== constants.deliveringStates.publishing) {
                experience.showStatus(false);
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
                notifyError(localizationManager.localize('deleteSeveralExperiencesError'));
                return;
            }

            var selectedExperience = selectedExperiences[0];
            if (selectedExperience.objectives.length > 0) {
                notifyError(localizationManager.localize('experienceCannotBeDeleted'));
                return;
            }

            notify.hide();

            experienceRepository.removeExperience(selectedExperience.id).then(function () {
                viewModel.experiences(_.without(viewModel.experiences(), selectedExperience));
            });
        }

        function activate() {
            var sortedExperiences = _.sortBy(dataContext.experiences, function (experience) {
                return -experience.createdOn;
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
                experience.deliveringState = ko.observable(item.deliveringState);
                experience.packageUrl = ko.observable(item.packageUrl);
                experience.publishedPackageUrl = ko.observable(item.publishedPackageUrl);
                experience.modifiedOn = item.modifiedOn;
                experience.isSelected = ko.observable(false);
                experience.showStatus = ko.observable();
                
                experience.publishPackageExists = ko.computed(function () {
                    return !_.isNullOrUndefined(this.publishedPackageUrl()) && !_.isEmptyOrWhitespace(this.publishedPackageUrl());
                }, experience);

                var storageItem = storage[item.id] || { showStatus: false, deliveringState: constants.deliveringStates.notStarted };
                var showStatus = storageItem.showStatus || (item.deliveringState === constants.deliveringStates.building || item.deliveringState === constants.deliveringStates.publishing ||
                     item.deliveringState !== storageItem.deliveringState);
                experience.showStatus(showStatus);
                
                return experience;
            }));
        }

        function deactivate() {
            storage = [];
            _.each(viewModel.experiences(), function (item) {
                storage[item.id] = {
                    showStatus: item.showStatus(),
                    deliveringState: item.deliveringState()
                };
            });
        };
        
        function notifyError(message) {
            if (!_.isNullOrUndefined(message)) {
                notify.error(message);
            }
        }

        //#region App-wide messaging

        app.on(constants.messages.experience.build.started).then(function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.deliveringState(constants.deliveringStates.building);
                expVm.showStatus(true);
            });
        });

        app.on(constants.messages.experience.build.completed, function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                
                expVm.deliveringState(constants.deliveringStates.succeed);
                expVm.packageUrl(experience.packageUrl);
            });
        });

        app.on(constants.messages.experience.build.failed, function (experienceId) {
            updateExperienceViewModelIfExists(experienceId, function (expVm) {
                expVm.deliveringState(constants.deliveringStates.failed);
                expVm.packageUrl('');
            });
        });
        
        // #region publish events
        app.on(constants.messages.experience.publish.started).then(function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.deliveringState(constants.deliveringStates.publishing);
                expVm.showStatus(true);
            });
        });

        app.on(constants.messages.experience.publish.completed, function (experience) {
            updateExperienceViewModelIfExists(experience.id, function (expVm) {
                expVm.deliveringState(constants.deliveringStates.succeed);
                expVm.publishedPackageUrl(experience.publishedPackageUrl);
            });
        });

        app.on(constants.messages.experience.publish.failed, function (experienceId) {
            updateExperienceViewModelIfExists(experienceId, function (expVm) {
                expVm.deliveringState(constants.deliveringStates.failed);
                expVm.publishedPackageUrl('');
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