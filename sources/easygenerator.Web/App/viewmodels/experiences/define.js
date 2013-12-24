define(['plugins/router', 'constants', 'eventTracker', 'repositories/experienceRepository', 'services/deliverService', 'viewmodels/objectives/objectiveBrief',
        'localization/localizationManager', 'notify', 'repositories/objectiveRepository'],
    function (router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, notify, objectiveRepository) {
        "use strict";

        var
            events = {
                navigateToObjectiveDetails: 'Navigate to objective details',
                navigateToCreateObjective: 'Navigate to create objective',
                selectObjective: 'Select Objective',
                unselectObjective: 'Unselect Objective',
                updateExperienceTitle: 'Update experience title',
                showAllAvailableObjectives: 'Show all available objectives',
                connectSelectedObjectivesToExperience: 'Connect selected objectives to experience',
                showConnectedObjectives: 'Show connected objectives',
                unrelateObjectivesFromExperience: 'Unrelate objectives from experience'
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
            connectedObjectives = ko.observableArray([]),
            availableObjectives = ko.observableArray([]),
            originalTitle = '',
            objectivesMode = ko.observable(''),
            isEditing = ko.observable(),

            objectivesListModes = {
                appending: 'appending',
                display: 'display'
            },

            canDisconnectObjectives = ko.computed(function () {
                return _.some(connectedObjectives(), function (item) {
                    return item.isSelected();
                });
            }),

            canConnectObjectives = ko.computed(function () {
                return _.some(availableObjectives(), function (item) {
                    return item.isSelected();
                });
            }),

            navigateToObjectiveDetails = function (objective) {
                eventTracker.publish(events.navigateToObjectiveDetails);
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
                eventTracker.publish(events.navigateToCreateObjective);
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
                    eventTracker.publish(events.unselectObjective);
                    objective.isSelected(false);
                } else {
                    eventTracker.publish(events.selectObjective);
                    objective.isSelected(true);
                }
            },
            startEditTitle = function () {
                this.originalTitle = title();
                isEditing(true);
            },
            endEditTitle = function () {
                title(title().trim());
                if (title.isValid() && title() != this.originalTitle) {
                    eventTracker.publish(events.updateExperienceTitle);
                    repository.updateExperienceTitle(this.id, title()).then(notify.saved);
                } else {
                    title(this.originalTitle);
                }
                isEditing(false);
            },

            showAllAvailableObjectives = function () {
                if (objectivesMode() == objectivesListModes.appending) {
                    return;
                }

                eventTracker.publish(events.showAllAvailableObjectives);

                var that = this;

                objectiveRepository.getCollection().then(function (objectivesList) {
                    var relatedIds = _.pluck(that.connectedObjectives(), 'id');

                    availableObjectives(_.chain(objectivesList)
                        .filter(function (item) {
                            return !_.include(relatedIds, item.id);
                        })
                        .sortBy(function (item) {
                            return -item.createdOn;
                        })
                        .map(function (item) {
                            var mappedObjective = objectiveBrief(item);
                            mappedObjective._original = item;

                            return mappedObjective;
                        })
                        .value());

                    that.objectivesMode(objectivesListModes.appending);
                });
            },
            showConnectedObjectives = function () {
                if (objectivesMode() == objectivesListModes.display) {
                    return;
                }

                eventTracker.publish(events.showConnectedObjectives);

                _.each(connectedObjectives(), function (item) {
                    item.isSelected(false);
                });

                objectivesMode(objectivesListModes.display);
            },

            connectObjectives = function () {
                eventTracker.publish(events.connectSelectedObjectivesToExperience);
                var that = this;

                var objectivesToRelate = _.chain(that.availableObjectives()).filter(function (item) {
                    return item.isSelected();
                }).pluck('_original').value();
                
                if (objectivesToRelate.length == 0) {
                    return;
                }

                repository.relateObjectives(that.id, objectivesToRelate).then(function (response) {
                    that.connectedObjectives(_.chain(response.relatedObjectives).sortBy(function (item) {
                        return -item.createdOn;
                    }).map(function (item) {
                        return objectiveBrief(item);
                    }).union(that.connectedObjectives()).value());

                    that.availableObjectives(that.availableObjectives().filter(function (item) {
                        return !_.contains(response.relatedObjectives, item._original);
                    }));

                    notify.saved();

                    if (objectivesToRelate.length != response.relatedObjectives.length) {
                        notify.error(localizationManager.localize('objectivesNotFoundError'));
                    }
                });
            },

            disconnectSelectedObjectives = function () {
                eventTracker.publish(events.unrelateObjectivesFromExperience);

                var that = this,
                    selectedObjectives = _.filter(this.connectedObjectives(), function (item) {
                        return item.isSelected();
                    });

                repository.unrelateObjectives(this.id, _.map(selectedObjectives, function (item) { return item; }))
                    .then(function (modifiedOn) {
                        that.connectedObjectives(_.difference(that.connectedObjectives(), selectedObjectives));
                        notify.saved();
                    });
            },

            activate = function (experienceId) {
                var that = this;
                return repository.getById(experienceId).then(function (experience) {
                    that.id = experience.id;
                    that.title(experience.title);
                    that.originalTitle = experience.title;
                    that.objectivesMode(that.objectivesListModes.display);
                    that.connectedObjectives(_.chain(experience.objectives)
                        .sortBy(function (objective) { return -objective.createdOn; })
                        .map(function (objective) {
                            return objectiveBrief(objective);
                        })
                        .value());

                    isEditing(false);
                }).fail(function (reason) {
                    router.activeItem.settings.lifecycleData = { redirect: '404' };
                    throw reason;
                });
            };

        return {
            activate: activate,

            id: id,
            title: title,
            originalTitle: originalTitle,
            connectedObjectives: connectedObjectives,
            availableObjectives: availableObjectives,
            objectivesMode: objectivesMode,
            objectivesListModes: objectivesListModes,
            canDisconnectObjectives: canDisconnectObjectives,
            canConnectObjectives: canConnectObjectives,

            navigateToObjectiveDetails: navigateToObjectiveDetails,
            navigateToCreateObjective: navigateToCreateObjective,

            toggleObjectiveSelection: toggleObjectiveSelection,
            disconnectSelectedObjectives: disconnectSelectedObjectives,

            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,

            experienceTitleMaxLength: constants.validation.experienceTitleMaxLength,
            isEditing: isEditing,

            showAllAvailableObjectives: showAllAvailableObjectives,
            connectObjectives: connectObjectives,
            showConnectedObjectives: showConnectedObjectives
        };
    }
);