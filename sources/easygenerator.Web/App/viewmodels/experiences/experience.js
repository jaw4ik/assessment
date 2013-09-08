define(['dataContext', 'plugins/router', 'constants', 'eventTracker', 'repositories/experienceRepository', 'services/buildExperience', 'viewmodels/objectives/objectiveBrief', 'localization/localizationManager', 'notify'],
    function (dataContext, router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, notify) {
        "use strict";

        var
            events = {
                category: 'Experience',
                buildExperience: 'Build experience',
                downloadExperience: 'Download experience',
                navigateToExperiences: 'Navigate to experiences',
                navigateToNextExperience: 'Navigate to next experience',
                navigateToPreviousExperience: 'Navigate to previous experience',
                navigateToObjectiveDetails: 'Navigate to Objective details',
                selectObjective: 'Select Objective',
                unselectObjective: 'Unselect Objective',
                updateExperienceTitle: 'Update experience title'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var id = '',
            title = ko.observable('').extend({
                require: true,
                maxLength: constants.validation.experienceTitleMaxLength
            }),
            objectives = [],
            status = ko.observable(),
            isFirstBuild = ko.observable(true),
            nextExperienceId = null,
            previousExperienceId = null,
            previousTitle = '',
            experience = [],
            createdOn = null,
            modifiedOn = ko.observable(),
            builtOn = ko.observable(),
            language = ko.observable(),

        isEditing = ko.observable();

        var navigateToExperiences = function () {
            sendEvent(events.navigateToExperiences);
            router.navigate('experiences');
        },

        navigateToNextExperience = function () {
            sendEvent(events.navigateToNextExperience);
            if (_.isUndefined(this.nextExperienceId) || _.isNull(this.nextExperienceId)) {
                router.replace('404');
            } else {
                router.navigate('experience/' + this.nextExperienceId);
            }
        },

        navigateToPreviousExperience = function () {
            sendEvent(events.navigateToPreviousExperience);
            if (_.isUndefined(this.previousExperienceId) || _.isNull(this.previousExperienceId)) {
                router.replace('404');
            } else {
                router.navigate('experience/' + this.previousExperienceId);
            }
        },

        navigateToObjectiveDetails = function (objective) {
            sendEvent(events.navigateToObjectiveDetails);
            if (_.isUndefined(objective)) {
                throw 'Objective is undefined';
            }

            if (_.isNull(objective)) {
                throw 'Objective is null';
            }

            if (_.isUndefined(objective.id)) {
                throw 'Objective does not have id property';
            }

            if (_.isNull(objective.id)) {
                throw 'Objective id property is null';
            }

            router.navigate('objective/' + objective.id);
        },


        toggleObjectiveSelection = function (objective) {

            if (_.isUndefined(objective)) {
                throw 'Objective is undefined';
            }

            if (_.isNull(objective)) {
                throw 'Objective is null';
            }

            if (!ko.isObservable(objective.isSelected)) {
                throw 'Objective does not have isSelected observable';
            }

            if (objective.isSelected()) {
                sendEvent(events.unselectObjective);
                objective.isSelected(false);
            } else {
                sendEvent(events.selectObjective);
                objective.isSelected(true);
            }
        },

        buildExperience = function () {
            sendEvent(events.buildExperience);
            status(constants.buildingStatuses.inProgress);

            var that = this;
            service.build(this.id)
                .then(function (response) {
                    if (response.Success) {
                        that.status(constants.buildingStatuses.succeed);
                        that.builtOn(new Date());
                    } else {
                        that.status(constants.buildingStatuses.failed);
                        that.builtOn('');
                    }
                    that.experience.packageUrl = response.PackageUrl;
                    that.isFirstBuild(false);
                    repository.getById(that.id).then(function (item) {
                        item.packageUrl = response.PackageUrl;
                        item.builtOn = that.builtOn();
                    });
                });
        },

        downloadExperience = function () {
            sendEvent(events.downloadExperience);
            router.download('download/' + this.experience.packageUrl);
        },

        resetBuildStatus = function () {
            this.status(constants.buildingStatuses.notStarted);
            this.isFirstBuild(true);
        },

        startEditing = function () {
            previousTitle = title();
            isEditing(true);
        },

        saveChanges = function () {
            this.title(title().trim());
            if (title.isValid() && title().length != 0 && title() != previousTitle) {
                sendEvent(events.updateExperienceTitle);
                experience.title = title();
                var modified = new Date();
                this.modifiedOn(modified);
                repository.getById(this.id).then(function (item) {
                    item.title = title();
                    item.modifiedOn = modified;
                });
                notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
            } else {
                title(previousTitle);
            }
            this.isEditing(false);
        },

        activate = function (experienceId) {
            if (!_.isString(experienceId)) {
                router.replace('400');
                return undefined;
            }
            this.isEditing(false);
            this.language(localizationManager.currentLanguage);

            var that = this;
            return repository.getCollection().then(function (response) {
                var experiences = _.sortBy(response, function (item) {
                    return item.title;
                });

                that.experience = _.find(experiences, function (item) {
                    return item.id === experienceId;
                });

                if (!_.isObject(that.experience)) {
                    router.replace('404');
                    return;
                }

                that.createdOn = that.experience.createdOn;
                that.modifiedOn(that.experience.modifiedOn);
                that.builtOn(that.experience.builtOn);

                that.isFirstBuild(that.experience.buildingStatus == constants.buildingStatuses.notStarted);

                that.status(that.experience.buildingStatus);

                that.id = that.experience.id;
                that.title(that.experience.title);
                that.objectives = _.chain(that.experience.objectives)
                        .map(function (objective) {
                            return objectiveBrief(objective);
                        })
                        .sortBy(function (objective) { return objective.title.toLowerCase(); })
                        .value();

                var index = _.indexOf(experiences, that.experience);
                that.previousExperienceId = index != 0 ? experiences[index - 1].id : null;
                that.nextExperienceId = index != experiences.length - 1 ? experiences[index + 1].id : null;
            });
        };

        return {
            activate: activate,

            id: id,
            title: title,
            isFirstBuild: isFirstBuild,
            //template: 'Default',
            objectives: objectives,
            status: status,
            statuses: constants.buildingStatuses,
            experience: experience,
            nextExperienceId: nextExperienceId,
            previousExperienceId: previousExperienceId,

            navigateToExperiences: navigateToExperiences,
            navigateToNextExperience: navigateToNextExperience,
            navigateToPreviousExperience: navigateToPreviousExperience,
            navigateToObjectiveDetails: navigateToObjectiveDetails,

            toggleObjectiveSelection: toggleObjectiveSelection,

            buildExperience: buildExperience,
            downloadExperience: downloadExperience,
            startEditing: startEditing,
            saveChanges: saveChanges,

            resetBuildStatus: resetBuildStatus,
            language: language,
            createdOn: createdOn,
            modifiedOn: modifiedOn,
            builtOn: builtOn,
            experienceTitleMaxLength: constants.validation.experienceTitleMaxLength,
            isEditing: isEditing
        };
    }
);