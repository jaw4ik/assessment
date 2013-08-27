define(['dataContext', 'plugins/router', 'constants', 'eventTracker', 'repositories/experienceRepository', 'services/buildExperience', 'viewmodels/objectives/objectiveBrief', 'localization/localizationManager', 'services/downloadExperience'],
    function (dataContext, router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, downloadService) {
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
                unselectObjective: 'Unselect Objective'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var id = '',
            title = ko.observable('').extend({
                require: true,
                maxLength: 255
            }),
            objectives = [],
            status = ko.observable(),
            isFirstBuild = ko.observable(true),
            nextExperienceId = null,
            previousExperienceId = null,
            previousTitle = '',
            experience = [],
            notification = {
                text: ko.observable(''),
                visibility: ko.observable(false),
                close: function () { notification.visibility(false); },
                update: function () {
                    var message = localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString();
                    notification.text(message);
                    notification.visibility(true);
                }
            };

        title.isEditing = ko.observable(false);

        var navigateToExperiences = function () {
            sendEvent(events.navigateToExperiences);
            router.navigate('experiences');
        },

        navigateToNextExperience = function () {
            sendEvent(events.navigateToNextExperience);
            if (_.isUndefined(this.nextExperienceId) || _.isNull(this.nextExperienceId)) {
                router.navigate('404');
            } else {
                router.navigate('experience/' + this.nextExperienceId);
            }
        },

        navigateToPreviousExperience = function () {
            sendEvent(events.navigateToPreviousExperience);
            if (_.isUndefined(this.previousExperienceId) || _.isNull(this.previousExperienceId)) {
                router.navigate('404');
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
            return service.build(this.id)
                .then(function (response) {
                    if (response.Success) {
                        that.status(constants.buildingStatuses.succeed);
                    } else {
                        that.status(constants.buildingStatuses.failed);
                    }
                    that.experience.packageUrl = response.PackageUrl;
                    that.isFirstBuild(false);
                    repository.getById(that.id).then(function (item) {
                        item.packageUrl = response.PackageUrl;
                    });
                });
        },

        downloadExperience = function () {
            sendEvent(events.downloadExperience);
            downloadService.download(this.experience.packageUrl);
        },

        resetBuildStatus = function () {
            this.status(constants.buildingStatuses.notStarted);
            this.isFirstBuild(true);
        },

        startEditing = function () {
            previousTitle = title();
            title.isEditing(true);
        },

        saveChanges = function () {
            if (title.isValid() && title().length != 0) {
                experience.title = title();
                notification.update();
            } else {
                title(previousTitle);
            }
        },

        activate = function (experienceId) {
            if (!_.isString(experienceId)) {
                router.navigate('400');
                return undefined;
            }

            var that = this;
            return repository.getCollection().then(function (response) {
                var experiences = _.sortBy(response, function (item) {
                    return item.title;
                });
                
                that.experience = _.find(experiences, function (item) {
                    return item.id == experienceId;
                });
                
                if (!_.isObject(that.experience)) {
                    router.navigate('404');
                    return;
                }

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
            notification: notification,
            experience:experience,
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

            resetBuildStatus: resetBuildStatus
        };
    }
);