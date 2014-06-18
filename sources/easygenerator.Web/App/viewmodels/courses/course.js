define(['plugins/router', 'constants', 'eventTracker', 'repositories/courseRepository', 'services/publishService', 'viewmodels/objectives/objectiveBrief',
        'localization/localizationManager', 'notify', 'repositories/objectiveRepository', 'viewmodels/common/contentField', 'clientContext', 'ping', 'models/backButton',
        'viewmodels/courses/collaboration/collaborators', 'userContext', 'durandal/app', 'repositories/collaboratorRepository'],
    function (router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, notify, objectiveRepository, vmContentField, clientContext, ping, BackButton,
        vmCollaborators, userContext, app, collaboratorRepository) {
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
                unrelateObjectivesFromCourse: 'Unrelate objectives from course',
                navigateToCourses: 'Navigate to courses',
                changeOrderObjectives: 'Change order of learning objectives'
            };

        var eventsForCourseContent = {
            addContent: 'Define introduction',
            beginEditText: 'Start editing introduction',
            endEditText: 'End editing introduction'
        };

        var viewModel = {
            id: '',
            title: (function () {
                var value = ko.observable();

                value.isValid = ko.computed(function () {
                    var length = value() ? value().trim().length : 0;
                    return length > 0 && length <= constants.validation.courseTitleMaxLength;
                }, this);
                return value;
            })(),
            connectedObjectives: ko.observableArray([]),
            availableObjectives: ko.observableArray([]),
            objectivesMode: ko.observable(''),
            isEditing: ko.observable(),
            courseIntroductionContent: {},
            language: ko.observable(''),
            objectivesListModes: {
                appending: 'appending',
                display: 'display'
            },
            canDisconnectObjectives: ko.observable(false),
            canConnectObjectives: ko.observable(false),

            navigateToObjectiveDetails: navigateToObjectiveDetails,
            navigateToCreateObjective: navigateToCreateObjective,
            navigateToCoursesEvent: navigateToCoursesEvent,

            toggleObjectiveSelection: toggleObjectiveSelection,
            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,
            showAllAvailableObjectives: showAllAvailableObjectives,
            showConnectedObjectives: showConnectedObjectives,
            courseTitleMaxLength: constants.validation.courseTitleMaxLength,
            disconnectSelectedObjectives: disconnectSelectedObjectives,
            isReorderingObjectives: ko.observable(false),
            startReorderingObjectives: startReorderingObjectives,
            endReorderingObjectives: endReorderingObjectives,
            reorderObjectives: reorderObjectives,
            isSortingEnabled: ko.observable(true),
            collaborators: null,

            canActivate: canActivate,
            activate: activate,

            backButtonData: new BackButton({
                url: 'courses',
                backViewName: localizationManager.localize('courses'),
                callback: navigateToCoursesEvent
            }),

            connectObjective: connectObjective,
            disconnectObjective: disconnectObjective,

            titleUpdated: titleUpdated,
            introductionContentUpdated: introductionContentUpdated,
            objectivesReordered: objectivesReordered,
            objectiveConnected: objectiveConnected,
            objectivesDisconnected: objectivesDisconnected,

            objectiveTitleUpdated: objectiveTitleUpdated,
            objectiveUpdated: objectiveUpdated
        };

        viewModel.canDisconnectObjectives = ko.computed(function () {
            return _.some(viewModel.connectedObjectives(), function (item) {
                return item.isSelected();
            });
        });

        viewModel.canConnectObjectives = ko.computed(function () {
            return _.some(viewModel.availableObjectives(), function (item) {
                return item.isSelected();
            });
        });

        viewModel.isSortingEnabled = ko.computed(function () {
            return viewModel.connectedObjectives().length != 1;
        });

        app.on(constants.messages.course.titleUpdatedByCollaborator, titleUpdated);
        app.on(constants.messages.course.introductionContentUpdatedByCollaborator, introductionContentUpdated);
        app.on(constants.messages.course.objectivesReorderedByCollaborator, objectivesReordered);
        app.on(constants.messages.course.objectiveRelatedByCollaborator, objectiveConnected);
        app.on(constants.messages.course.objectivesUnrelatedByCollaborator, objectivesDisconnected);
        app.on(constants.messages.objective.titleUpdatedByCollaborator, objectiveTitleUpdated);
        app.on(constants.messages.objective.questionsReorderedByCollaborator, objectiveUpdated);
        app.on(constants.messages.question.createdByCollaborator, objectiveUpdated);
        app.on(constants.messages.question.deletedByCollaborator, objectiveUpdated);

        return viewModel;

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

        function navigateToObjectiveDetails(objective) {
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

            router.navigate('objective/' + objective.id + '?courseId=' + viewModel.id);
        }

        function navigateToCreateObjective() {
            eventTracker.publish(events.navigateToCreateObjective);
            router.navigate('objective/create?courseId=' + viewModel.id);
        }

        function toggleObjectiveSelection(objective) {

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
        }
        function startEditTitle() {
            viewModel.isEditing(true);
        }
        function endEditTitle() {
            viewModel.title(viewModel.title().trim());
            viewModel.isEditing(false);

            var courseTitle = null;
            repository.getById(viewModel.id)
                .then(function (response) {
                    courseTitle = response.title;
                    if (viewModel.title() == courseTitle)
                        return;

                    eventTracker.publish(events.updateCourseTitle);

                    if (viewModel.title.isValid()) {
                        repository.updateCourseTitle(viewModel.id, viewModel.title()).then(notify.saved);
                    } else {
                        viewModel.title(courseTitle);
                    }
                });
        }

        function showAllAvailableObjectives() {
            if (viewModel.objectivesMode() == viewModel.objectivesListModes.appending) {
                return;
            }

            eventTracker.publish(events.showAllAvailableObjectives);

            var that = viewModel;

            objectiveRepository.getCollection().then(function (objectivesList) {
                var relatedIds = _.pluck(that.connectedObjectives(), 'id');
                var objectives = _.filter(objectivesList, function (item) {
                    return !_.include(relatedIds, item.id);
                });
                mapAvailableObjectives(objectives);

                that.objectivesMode(viewModel.objectivesListModes.appending);
            });
        }

        function mapAvailableObjectives(objectives) {
            viewModel.availableObjectives(_.chain(objectives)
                    .filter(function (item) {
                        return item.createdBy == userContext.identity.email;
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
        }


        function showConnectedObjectives() {
            if (viewModel.objectivesMode() == viewModel.objectivesListModes.display) {
                return;
            }

            eventTracker.publish(events.showConnectedObjectives);

            _.each(viewModel.connectedObjectives(), function (item) {
                item.isSelected(false);
            });

            viewModel.objectivesMode(viewModel.objectivesListModes.display);
        }

        function connectObjective(objective) {
            if (_.contains(viewModel.connectedObjectives(), objective.item)) {
                var objectives = _.map(viewModel.connectedObjectives(), function (item) {
                    return {
                        id: item.id
                    };
                });
                objectives.splice(objective.sourceIndex, 1);
                objectives.splice(objective.targetIndex, 0, { id: objective.item.id });
                eventTracker.publish(events.changeOrderObjectives);
                repository.updateObjectiveOrder(viewModel.id, objectives).then(function () {
                    notify.saved();
                });
                return;
            }

            eventTracker.publish(events.connectSelectedObjectivesToCourse);
            repository.relateObjective(viewModel.id, mapObjective(objective.item), objective.targetIndex).then(function () {
                notify.saved();
            });
        }

        function mapObjective(item) {
            return {
                id: item.id,
                title: item.title(),
                image: item.image,
                questionsCount: item.questionsCount,
                modifiedOn: item.modifiedOn(),
                isSelected: item.isSelected()
            };

        }

        function disconnectObjective(objective) {
            if (_.contains(viewModel.availableObjectives(), objective.item)) {
                return;
            }
            eventTracker.publish(events.unrelateObjectivesFromCourse);
            repository.unrelateObjectives(viewModel.id, [objective.item]).then(function () {
                notify.saved();
            });
        }

        function disconnectSelectedObjectives() {
            if (!viewModel.canDisconnectObjectives())
                return;

            eventTracker.publish(events.unrelateObjectivesFromCourse);

            var that = viewModel,
                selectedObjectives = _.filter(viewModel.connectedObjectives(), function (item) {
                    return item.isSelected();
                });

            repository.unrelateObjectives(viewModel.id, _.map(selectedObjectives, function (item) { return item; }))
                .then(function () {
                    that.connectedObjectives(_.difference(that.connectedObjectives(), selectedObjectives));
                    notify.saved();
                });
        }

        function startReorderingObjectives() {
            viewModel.isReorderingObjectives(true);
        }

        function endReorderingObjectives() {
            viewModel.isReorderingObjectives(false);
        }

        function reorderObjectives() {
            eventTracker.publish(events.changeOrderObjectives);
            repository.updateObjectiveOrder(viewModel.id, viewModel.connectedObjectives()).then(function () {
                notify.saved();
            });
        }

        function canActivate() {
            return ping.execute();
        }

        function activate(courseId) {
            viewModel.language(localizationManager.currentLanguage);

            return repository.getById(courseId).then(function (course) {
                viewModel.id = course.id;

                clientContext.set('lastVistedCourse', course.id);
                clientContext.set('lastVisitedObjective', null);

                viewModel.title(course.title);
                viewModel.objectivesMode(viewModel.objectivesListModes.display);
                viewModel.connectedObjectives(_.chain(course.objectives)
                    .map(function (objective) {
                        return objectiveBrief(objective);
                    })
                    .value());

                viewModel.isEditing(false);
                viewModel.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, function (content) { return repository.updateIntroductionContent(course.id, content); });

                return collaboratorRepository.getCollection(courseId).then(function (collaborators) {
                    viewModel.collaborators = new vmCollaborators(course.id, course.createdBy, collaborators);
                });

            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function objectiveTitleUpdated(objective) {
            var vmObjective = getObjectiveViewModel(objective.id);

            if (_.isObject(vmObjective)) {
                vmObjective.title(objective.title);
                vmObjective.modifiedOn(objective.modifiedOn);
            }
        }

        function objectiveUpdated(objective) {
            var vmObjective = getObjectiveViewModel(objective.id);

            if (_.isObject(vmObjective)) {
                vmObjective.modifiedOn(objective.modifiedOn);
            }
        }

        function getObjectiveViewModel(objectiveId) {
            var objectives = viewModel.connectedObjectives().concat(viewModel.availableObjectives());

            return _.find(objectives, function (item) {
                return item.id == objectiveId;
            });
        }

        function titleUpdated(course) {
            if (course.id != viewModel.id || viewModel.isEditing())
                return;

            viewModel.title(course.title);
        }

        function introductionContentUpdated(course) {
            if (course.id != viewModel.id || viewModel.courseIntroductionContent.isEditing())
                return;

            viewModel.courseIntroductionContent.text(course.introductionContent);
        }

        function objectivesReordered(course) {
            if (viewModel.id != course.id || viewModel.isReorderingObjectives()) {
                return;
            }

            viewModel.connectedObjectives(_.chain(course.objectives)
                   .map(function (objective) {
                       return _.find(viewModel.connectedObjectives(), function (obj) {
                           return obj.id == objective.id;
                       });
                   })
                   .value());
        }

        function objectiveConnected(courseId, objective, targetIndex) {
            if (viewModel.id != courseId) {
                return;
            }

            var objectives = viewModel.connectedObjectives();
            var isConnected = _.some(objectives, function (item) {
                return item.id == objective.id;
            });

            if (isConnected) {
                objectives = _.reject(objectives, function (item) {
                    return item.id == objective.id;
                });
            }

            var vmObjective = objectiveBrief(objective);
            if (!_.isNullOrUndefined(targetIndex)) {
                objectives.splice(targetIndex, 0, vmObjective);
            } else {
                objectives.push(vmObjective);
            }

            viewModel.connectedObjectives(objectives);

            var availableObjectives = viewModel.availableObjectives();
            viewModel.availableObjectives(_.reject(availableObjectives, function (item) {
                return objective.id == item.id;
            }));
        }

        function objectivesDisconnected(courseId, disconnectedObjectiveIds) {
            if (viewModel.id != courseId) {
                return;
            }

            var connectedObjectives = viewModel.connectedObjectives();
            viewModel.connectedObjectives(_.reject(connectedObjectives, function (item) {
                return _.some(disconnectedObjectiveIds, function (id) {
                    return id == item.id;
                });
            }));

            objectiveRepository.getCollection().then(function (objectivesList) {
                var relatedIds = _.pluck(viewModel.connectedObjectives(), 'id');
                var objectives = _.filter(objectivesList, function (item) {
                    return !_.include(relatedIds, item.id);
                });
                mapAvailableObjectives(objectives);
            });
        }
    }
);