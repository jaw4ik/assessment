define(['plugins/router', 'constants', 'eventTracker', 'repositories/experienceRepository', 'services/buildExperience', 'viewmodels/objectives/objectiveBrief',
        'localization/localizationManager', 'notify', 'repositories/objectiveRepository', 'repositories/templateRepository', 'clientContext'],
    function (router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, notify, objectiveRepository, templateRepository, clientContext) {
        "use strict";

        var
            events = {
                navigateToObjectiveDetails: 'Navigate to objective details',
                navigateToCreateObjective: 'Navigate to create objective',
                selectObjective: 'Select Objective',
                unselectObjective: 'Unselect Objective',
                updateExperienceTitle: 'Update experience title',
                startAppendingRelatedObjectives: 'Start appending related objectives',
                finishAppendingRelatedObjectives: 'Finish appending related objectives',
                unrelateObjectivesFromExperience: 'Unrelate objectives from experience'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };


        var
            id = '',
            title = (function () {
                var value = ko.observable();

                value.isValid = ko.computed(function () {
                    var length = value() ? value().trim().length : 0;
                    return length > 0 && length <= constants.validation.experienceTitleMaxLength;
                }, this);
                return value;
            })(),
            relatedObjectives = ko.observableArray([]),
            availableObjectives = ko.observableArray([]),
            previousTitle = '',
            objectivesMode = ko.observable(''),
            isEditing = ko.observable(),

            objectivesListModes = {
                appending: 'appending',
                display: 'display'
            },

            canUnrelateObjectives = ko.computed(function () {
                return _.some(relatedObjectives(), function (item) {
                    return item.isSelected();
                });
            }),

            hintPopup = {
                displayed: ko.observable(false),

                show: function () {
                    if (clientContext.get('showRelateObjectivesHintPopup') !== false) {
                        this.displayed(true);
                    }
                },
                hide: function () {
                    this.displayed(false);
                },
                close: function () {
                    this.displayed(false);
                    clientContext.set('showRelateObjectivesHintPopup', false);
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

                router.navigate('objective/' + objective.id + '?experienceId=' + this.id);
            },

            navigateToCreateObjective = function () {
                sendEvent(events.navigateToCreateObjective);
                router.navigate('objective/create?experienceId=' + this.id);
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
            startEditTitle = function () {
                previousTitle = title();
                isEditing(true);
            },
            endEditTitle = function () {
                title(title().trim());
                if (title.isValid() && title() != previousTitle) {
                    sendEvent(events.updateExperienceTitle);
                    repository.updateExperienceTitle(this.id, title()).then(function (updatedOn) {
                        notify.info(localizationManager.localize('savedAt') + ' ' + updatedOn.toLocaleTimeString());
                    });
                } else {
                    title(previousTitle);
                }
                isEditing(false);
            },

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
                    that.hintPopup.show();
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
                    that.hintPopup.hide();
                    return;
                }

                repository.relateObjectives(that.id, addingObjectives)
                    .then(function () {
                        that.relatedObjectives(_.chain(addingObjectives)
                            .map(function (item) {
                                return objectiveBrief(item);
                            })
                            .union(that.relatedObjectives())
                            .sortBy(function (item) {
                                return item.title.toLowerCase();
                            }).value());

                        notify.info(localizationManager.localize('savedAt') + ' ' + new Date().toLocaleTimeString());
                        that.objectivesMode(objectivesListModes.display);
                        that.hintPopup.hide();
                    });
            },
            unrelateSelectedObjectives = function () {
                sendEvent(events.unrelateObjectivesFromExperience);

                var that = this,
                    selectedObjectives = _.filter(this.relatedObjectives(), function (item) {
                        return item.isSelected();
                    });

                repository.unrelateObjectives(this.id, _.map(selectedObjectives, function (item) { return item; }))
                    .then(function () {
                        that.relatedObjectives(_.difference(that.relatedObjectives(), selectedObjectives));
                        notify.info(localizationManager.localize('savedAt') + ' ' + new Date().toLocaleTimeString());
                    });
            },

            activate = function (experienceId) {
                var that = this;
                return repository.getById(experienceId).then(function (experience) {
                    that.id = experience.id;
                    that.title(experience.title);
                    that.objectivesMode(that.objectivesListModes.display);
                    that.relatedObjectives(_.chain(experience.objectives)
                        .map(function (objective) {
                            return objectiveBrief(objective);
                        })
                        .sortBy(function (objective) { return objective.title.toLowerCase(); })
                        .value());

                    clientContext.set('lastVistedExperience', experience.id);
                    hintPopup.displayed(false);

                    clientContext.set('lastVisitedObjective', null);
                    isEditing(false);
                }).fail(function () {
                    router.replace('404');
                });
            };



        return {
            activate: activate,

            id: id,
            title: title,
            relatedObjectives: relatedObjectives,
            availableObjectives: availableObjectives,
            objectivesMode: objectivesMode,
            objectivesListModes: objectivesListModes,
            canUnrelateObjectives: canUnrelateObjectives,
            hintPopup: hintPopup,

            navigateToObjectiveDetails: navigateToObjectiveDetails,
            navigateToCreateObjective: navigateToCreateObjective,

            toggleObjectiveSelection: toggleObjectiveSelection,
            unrelateSelectedObjectives: unrelateSelectedObjectives,

            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,

            experienceTitleMaxLength: constants.validation.experienceTitleMaxLength,
            isEditing: isEditing,

            startAppendingObjectives: startAppendingObjectives,
            finishAppendingObjectives: finishAppendingObjectives
        };
    }
);