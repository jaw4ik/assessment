define(['dataContext', 'plugins/router', 'constants', 'eventTracker', 'repositories/experienceRepository', 'repositories/templateRepository', 'services/buildExperience', 'viewmodels/objectives/objectiveBrief', 'localization/localizationManager', 'notify'],
    function (dataContext, router, constants, eventTracker, repository, templateRepository, service, objectiveBrief, localizationManager, notify) {
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
                updateExperienceTitle: 'Update experience title',
                updateExperienceTemplate: 'Change experience template to'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var id = '',
            title = ko.observable(''),
            objectives = [],
            templates = [],
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
            templateId = ko.observable(),
        isEditing = ko.observable();
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.experienceTitleMaxLength;
        });

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

        startEditTitle = function () {
            previousTitle = title();
            isEditing(true);
        },

        endEditTitle = function () {
            this.title(title().trim());
            if (title.isValid() && title() != previousTitle) {
                sendEvent(events.updateExperienceTitle);
                updateExperience.call(this);
            } else {
                title(previousTitle);
            }
            this.isEditing(false);
        },

        updateExperienceTemplate = function () {
            var selectedTemplate = _.find(this.templates, function(item) {
                return item.id === templateId();
            });

            sendEvent(events.updateExperienceTemplate + ' \'' + selectedTemplate.name + '\'');
            updateExperience.call(this);
        },

        updateExperience = function () {
            var that = this;
            repository.updateExperience({ id: that.id, title: title(), templateId: templateId() }).then(function (updatedExperience) {
                that.modifiedOn(updatedExperience.modifiedOn);
                notify.info(localizationManager.localize('lastSaving') + ': ' + updatedExperience.modifiedOn.toLocaleTimeString());
            });
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
                that.templateId(that.experience.templateId);

                templateRepository.getCollection().then(function (templatesResponse) {
                    that.templates = _.chain(templatesResponse)
                       .map(function (template) {
                           return {
                               id: template.id,
                               name: template.name
                           };
                       })
                       .sortBy(function (template) { return template.name.toLowerCase(); })
                       .value();
                });
            });
        };

        return {
            activate: activate,

            id: id,
            title: title,
            isFirstBuild: isFirstBuild,
            templateId: templateId,
            objectives: objectives,
            templates: templates,
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
            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,
            updateExperienceTemplate: updateExperienceTemplate,

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