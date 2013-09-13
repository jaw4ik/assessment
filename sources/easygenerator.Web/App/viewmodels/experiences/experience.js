define(['dataContext', 'plugins/router', 'constants', 'eventTracker', 'repositories/experienceRepository', 'services/buildExperience', 'viewmodels/objectives/objectiveBrief', 'localization/localizationManager', 'notify', 'repositories/objectiveRepository', 'repositories/templateRepository'],
    function (dataContext, router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, notify, objectiveRepository, templateRepository) {
        "use strict";

        //#region Events

        var
            events = {
                buildExperience: 'Build experience',
                downloadExperience: 'Download experience',
                navigateToExperiences: 'Navigate to experiences',
                navigateToNextExperience: 'Navigate to next experience',
                navigateToPreviousExperience: 'Navigate to previous experience',
                navigateToObjectiveDetails: 'Navigate to Objective details',
                selectObjective: 'Select Objective',
                unselectObjective: 'Unselect Objective',
                updateExperienceTitle: 'Update experience title',
                startAppendingRelatedObjectives: 'Start appending related objectives',
                finishAppendingRelatedObjectives: 'Finish appending related objectives',
                updateExperienceTemplate: 'Change experience template to',
                unrelateObjectivesFromExperience: 'Unrelate objectives from experience'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        //#endregion Events

        //#region Properties

        var
            id = '',
            title = ko.observable(''),
            relatedObjectives = ko.observableArray([]),
            availableObjectives = ko.observableArray([]),
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
            objectivesMode = ko.observable(''),
            templateId = ko.observable(),
            isEditing = ko.observable(),

            objectivesListModes = {
                appending: 'appending',
                display: 'display'
            },

            canUnrelateObjectives = ko.computed(function () {
                return _.some(relatedObjectives(), function (item) {
                    return item.isSelected();
                });
            });


        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.experienceTitleMaxLength;
        });

        //#endregion Properties

        //#region Navigation

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

        //#endregion Navigation

        //#region Built & Download

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

        //#endregion Built & Download

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

        //#region Relate/Unrelate

        startAppendingObjectives = function () {
            sendEvent(events.startAppendingRelatedObjectives);

            var that = this;

            objectiveRepository.getCollection().then(function (objectivesList) {
                var relatedIds = _.pluck(that.relatedObjectives(), 'id');

                availableObjectives(_.chain(objectivesList)
                    .filter(function (item) {
                        return !_.include(relatedIds, item.id);
                    })
                    .map(function (item) {
                        var mappedObjective = objectiveBrief(item);
                        mappedObjective._original = item;

                        return mappedObjective;
                    })
                    .sortBy(function (item) {
                        return item.title.toLowerCase();
                    }).value());

                that.objectivesMode(objectivesListModes.appending);
            });
        },

        finishAppendingObjectives = function () {
            sendEvent(events.finishAppendingRelatedObjectives);

            var that = this;

            var addingObjectives = _.chain(that.availableObjectives())
                .filter(function (item) {
                    return item.isSelected();
                })
                .pluck('_original')
                .value();

            if (addingObjectives.length == 0) {
                that.objectivesMode(that.objectivesListModes.display);
                return;
            }

            repository.relateObjectives(that.id, addingObjectives)
                .then(function (modifiedDate) {

                    that.relatedObjectives(_.chain(addingObjectives)
                        .map(function (item) {
                            return objectiveBrief(item);
                        })
                        .union(that.relatedObjectives())
                        .sortBy(function (item) {
                            return item.title.toLowerCase();
                        }).value());

                    that.modifiedOn(modifiedDate);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                    that.objectivesMode(objectivesListModes.display);
                });
        },

        //#endregion Relate/Unrelate

        updateExperienceTemplate = function () {
            var selectedTemplate = _.find(this.templates, function (item) {
                return item.id === templateId();
            });

            sendEvent(events.updateExperienceTemplate + ' \'' + selectedTemplate.name + '\'');
            updateExperience.call(this);
        },

        updateExperience = function () {
            var that = this;
            repository.updateExperience({ id: that.id, title: title(), templateId: templateId() })
                .then(function (updatedExperience) {
                    that.modifiedOn(updatedExperience.modifiedOn);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + updatedExperience.modifiedOn.toLocaleTimeString());
                });
        },

        activate = function (experienceId) {
            if (!_.isString(experienceId)) {
                router.replace('400');
                return undefined;
            }
            isEditing(false);
            language(localizationManager.currentLanguage);

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
                that.relatedObjectives(_.chain(that.experience.objectives)
                        .map(function (objective) {
                            return objectiveBrief(objective);
                        })
                        .sortBy(function (objective) { return objective.title.toLowerCase(); })
                        .value());

                that.objectivesMode(that.objectivesListModes.display);

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
        },

        unrelateSelectedObjectives = function () {
            sendEvent(events.unrelateObjectivesFromExperience);

            var
                that = this,
                selectedObjectives = _.filter(this.relatedObjectives(), function (item) {
                    return item.isSelected();
                });

            repository.unrelateObjectives(this.id, _.map(selectedObjectives, function (item) { return item.id; }))
                .then(function (modifiedDate) {
                    that.relatedObjectives(_.difference(that.relatedObjectives(), selectedObjectives));
                    that.modifiedOn(modifiedDate);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                });
        };

        return {
            activate: activate,

            id: id,
            title: title,
            isFirstBuild: isFirstBuild,
            templateId: templateId,
            relatedObjectives: relatedObjectives,
            availableObjectives: availableObjectives,
            templates: templates,
            status: status,
            statuses: constants.buildingStatuses,
            experience: experience,
            nextExperienceId: nextExperienceId,
            previousExperienceId: previousExperienceId,
            objectivesMode: objectivesMode,
            objectivesListModes: objectivesListModes,
            canUnrelateObjectives: canUnrelateObjectives,

            navigateToExperiences: navigateToExperiences,
            navigateToNextExperience: navigateToNextExperience,
            navigateToPreviousExperience: navigateToPreviousExperience,
            navigateToObjectiveDetails: navigateToObjectiveDetails,

            toggleObjectiveSelection: toggleObjectiveSelection,
            unrelateSelectedObjectives: unrelateSelectedObjectives,

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
            isEditing: isEditing,

            startAppendingObjectives: startAppendingObjectives,
            finishAppendingObjectives: finishAppendingObjectives
        };
    }
);