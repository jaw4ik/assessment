define(['plugins/router', 'constants', 'eventTracker', 'repositories/courseRepository', 'services/deliverService', 'viewmodels/objectives/objectiveBrief',
        'localization/localizationManager', 'notify', 'repositories/objectiveRepository', 'viewmodels/common/contentField'],
    function (router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, notify, objectiveRepository, vmContentField) {
        "use strict";

        var
            events = {
                navigateToObjectiveDetails: 'Navigate to objective details',
                navigateToCreateObjective: 'Navigate to create objective',
                selectObjective: 'Select Objective',
                unselectObjective: 'Unselect Objective',
                updateCourseTitle: 'Update course title',
                showAllAvailableObjectives: 'Show all available objectives',
                connectSelectedObjectivesToCourse: 'Connect selected objectives to course',
                showConnectedObjectives: 'Show connected objectives',
                unrelateObjectivesFromCourse: 'Unrelate objectives from course'
            };

        var eventsForCourseContent = {
            addContent: 'Define introduction',
            beginEditText: 'Start editing introduction',
            endEditText: 'End editing introduction'
        };

        var
            id = '',
            title = (function () {
                var value = ko.observable();

                value.isValid = ko.computed(function () {
                    var length = value() ? value().trim().length : 0;
                    return length > 0 && length <= constants.validation.courseTitleMaxLength;
                }, this);
                return value;
            })(),
            connectedObjectives = ko.observableArray([]),
            availableObjectives = ko.observableArray([]),
            originalTitle = '',
            objectivesMode = ko.observable(''),
            isEditing = ko.observable(),
            courseIntroductionContent = {},
            language = ko.observable(''),

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

                router.navigate('objective/' + objective.id + '?courseId=' + this.id);
            },

            navigateToCreateObjective = function () {
                eventTracker.publish(events.navigateToCreateObjective);
                router.navigate('objective/create?courseId=' + this.id);
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
                    eventTracker.publish(events.updateCourseTitle);
                    repository.updateCourseTitle(this.id, title()).then(notify.saved);
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
                eventTracker.publish(events.connectSelectedObjectivesToCourse);
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
                eventTracker.publish(events.unrelateObjectivesFromCourse);

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

            activate = function (courseId) {
                this.language(localizationManager.currentLanguage);
                var that = this;
                return repository.getById(courseId).then(function (course) {
                    that.id = course.id;
                    that.title(course.title);
                    that.originalTitle = course.title;
                    that.objectivesMode(that.objectivesListModes.display);
                    that.connectedObjectives(_.chain(course.objectives)
                        .sortBy(function (objective) { return -objective.createdOn; })
                        .map(function (objective) {
                            return objectiveBrief(objective);
                        })
                        .value());

                    isEditing(false);
                    that.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, function (content) { return repository.updateIntroductionContent(course.id, content); });
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

            courseTitleMaxLength: constants.validation.courseTitleMaxLength,
            isEditing: isEditing,

            showAllAvailableObjectives: showAllAvailableObjectives,
            connectObjectives: connectObjectives,
            showConnectedObjectives: showConnectedObjectives,
            courseIntroductionContent: courseIntroductionContent,
            language: language
        };
    }
);