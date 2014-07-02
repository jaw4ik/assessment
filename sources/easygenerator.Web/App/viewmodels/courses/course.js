define(['plugins/router', 'constants', 'eventTracker', 'repositories/courseRepository', 'services/publishService', 'viewmodels/objectives/objectiveBrief',
        'localization/localizationManager', 'notify', 'repositories/objectiveRepository', 'viewmodels/common/contentField', 'clientContext', 'ping', 'models/backButton',
        'userContext', 'durandal/app', './collaboration/collaborators'],
    function (router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, notify, objectiveRepository, vmContentField, clientContext, ping, BackButton,
        userContext, app, collaborators) {
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
            },

            eventsForCourseContent = {
                addContent: 'Define introduction',
                beginEditText: 'Start editing introduction',
                endEditText: 'End editing introduction'
            },

            objectivesListModes = {
                appending: 'appending',
                display: 'display'
            };

        var viewModel = {
            id: '',
            title: ko.observable(),
            createdBy: '',
            connectedObjectives: ko.observableArray([]),
            availableObjectives: ko.observableArray([]),
            objectivesMode: ko.observable(''),
            isEditing: ko.observable(),
            courseIntroductionContent: {},
            objectivesListModes: objectivesListModes,
            canDisconnectObjectives: ko.observable(false),
            canConnectObjectives: ko.observable(false),
            isReorderingObjectives: ko.observable(false),
            isSortingEnabled: ko.observable(true),
            courseTitleMaxLength: constants.validation.courseTitleMaxLength,
            isObjectivesListReorderedByCollaborator: ko.observable(false),
            collaborationWarning: ko.observable(''),

            backButtonData: new BackButton({
                url: 'courses',
                backViewName: localizationManager.localize('courses'),
                callback: navigateToCoursesEvent
            }),

            navigateToObjectiveDetails: navigateToObjectiveDetails,
            navigateToCreateObjective: navigateToCreateObjective,
            navigateToCoursesEvent: navigateToCoursesEvent,
            toggleObjectiveSelection: toggleObjectiveSelection,
            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,
            showAllAvailableObjectives: showAllAvailableObjectives,
            showConnectedObjectives: showConnectedObjectives,
            disconnectSelectedObjectives: disconnectSelectedObjectives,
            startReorderingObjectives: startReorderingObjectives,
            endReorderingObjectives: endReorderingObjectives,
            reorderObjectives: reorderObjectives,
            canActivate: canActivate,
            activate: activate,
            deactivate: deactivate,
            connectObjective: connectObjective,
            disconnectObjective: disconnectObjective,
            objectiveDisconnected: objectiveDisconnected,
            titleUpdated: titleUpdated,
            introductionContentUpdated: introductionContentUpdated,
            objectivesReordered: objectivesReordered,
            objectiveConnected: objectiveConnected,
            objectivesDisconnected: objectivesDisconnected,
            objectiveTitleUpdated: objectiveTitleUpdated,
            objectiveUpdated: objectiveUpdated,
            updateCollaborationWarning: updateCollaborationWarning,
            collaborators: collaborators
        };

        viewModel.title.isValid = ko.computed(function () {
            var length = viewModel.title() ? viewModel.title().trim().length : 0;
            return length > 0 && length <= constants.validation.courseTitleMaxLength;
        });

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
            return viewModel.connectedObjectives().length !== 1;
        });

        app.on(constants.messages.course.titleUpdatedByCollaborator, viewModel.titleUpdated);
        app.on(constants.messages.course.introductionContentUpdatedByCollaborator, viewModel.introductionContentUpdated);
        app.on(constants.messages.course.objectivesReorderedByCollaborator, viewModel.objectivesReordered);
        app.on(constants.messages.course.objectiveRelatedByCollaborator, viewModel.objectiveConnected);
        app.on(constants.messages.course.objectivesUnrelatedByCollaborator, viewModel.objectivesDisconnected);
        app.on(constants.messages.objective.titleUpdatedByCollaborator, viewModel.objectiveTitleUpdated);
        app.on(constants.messages.objective.questionsReorderedByCollaborator, viewModel.objectiveUpdated);
        app.on(constants.messages.question.createdByCollaborator, viewModel.objectiveUpdated);
        app.on(constants.messages.question.deletedByCollaborator, viewModel.objectiveUpdated);

        app.on(constants.messages.user.downgraded, viewModel.updateCollaborationWarning);
        app.on(constants.messages.user.upgradedToStarter, viewModel.updateCollaborationWarning);
        app.on(constants.messages.user.upgradedToPlus, viewModel.updateCollaborationWarning);

        viewModel.collaborators.members.subscribe(function () {
            viewModel.updateCollaborationWarning();
        });

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

            repository.getById(viewModel.id).then(function (response) {
                if (viewModel.title() === response.title) {
                    return;
                }

                eventTracker.publish(events.updateCourseTitle);

                if (viewModel.title.isValid()) {
                    repository.updateCourseTitle(viewModel.id, viewModel.title()).then(notify.saved);
                } else {
                    viewModel.title(response.title);
                }
            });
        }

        function showAllAvailableObjectives() {
            if (viewModel.objectivesMode() === objectivesListModes.appending) {
                return;
            }

            eventTracker.publish(events.showAllAvailableObjectives);

            objectiveRepository.getCollection().then(function (objectivesList) {
                var relatedIds = _.pluck(viewModel.connectedObjectives(), 'id');
                var objectives = _.filter(objectivesList, function (item) {
                    return !_.include(relatedIds, item.id);
                });
                mapAvailableObjectives(objectives);

                viewModel.objectivesMode(objectivesListModes.appending);
            });
        }

        function mapAvailableObjectives(objectives) {
            viewModel.availableObjectives(_.chain(objectives)
                    .filter(function (item) {
                        return item.createdBy === userContext.identity.email;
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
            if (viewModel.objectivesMode() === objectivesListModes.display) {
                return;
            }

            eventTracker.publish(events.showConnectedObjectives);

            _.each(viewModel.connectedObjectives(), function (item) {
                item.isSelected(false);
            });

            viewModel.objectivesMode(objectivesListModes.display);
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

        function objectiveDisconnected(objective) {
            if (objective.item.createdBy != userContext.identity.email) {
                viewModel.availableObjectives(_.reject(viewModel.availableObjectives(), function (item) {
                    return item.id == objective.item.id;
                }));
            }
        }

        function disconnectSelectedObjectives() {
            if (!viewModel.canDisconnectObjectives()) {
                return;
            }

            eventTracker.publish(events.unrelateObjectivesFromCourse);

            var selectedObjectives = _.filter(viewModel.connectedObjectives(), function (item) {
                return item.isSelected();
            });

            repository.unrelateObjectives(viewModel.id, _.map(selectedObjectives, function (item) {
                return item;
            })).then(function () {
                viewModel.connectedObjectives(_.difference(viewModel.connectedObjectives(), selectedObjectives));
                notify.saved();
            });
        }

        function startReorderingObjectives() {
            viewModel.isReorderingObjectives(true);
        }

        function endReorderingObjectives() {
            return Q.fcall(function () {
                if (!viewModel.isReorderingObjectives() || !viewModel.isObjectivesListReorderedByCollaborator()) {
                    viewModel.isReorderingObjectives(false);
                    return;
                }

                viewModel.isReorderingObjectives(false);
                viewModel.isObjectivesListReorderedByCollaborator(false);

                return repository.getById(viewModel.id).then(function (course) {
                    reorderConnectedObjectivesList(course);
                });
            });
        }

        function reorderObjectives() {
            eventTracker.publish(events.changeOrderObjectives);
            viewModel.isReorderingObjectives(false);
            repository.updateObjectiveOrder(viewModel.id, viewModel.connectedObjectives()).then(function () {
                notify.saved();
            });
        }

        function canActivate() {
            return ping.execute();
        }

        function activate(courseId) {
            viewModel.updateCollaborationWarning();
            return repository.getById(courseId).then(function (course) {
                viewModel.id = course.id;
                viewModel.createdBy = course.createdBy;

                clientContext.set('lastVistedCourse', course.id);
                clientContext.set('lastVisitedObjective', null);

                viewModel.title(course.title);
                viewModel.objectivesMode(objectivesListModes.display);
                viewModel.connectedObjectives(_.chain(course.objectives)
                    .map(function (objective) {
                        return objectiveBrief(objective);
                    })
                    .value());

                viewModel.isEditing(false);
                viewModel.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, function (content) {
                    return repository.updateIntroductionContent(course.id, content);
                });

            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function deactivate() {
            viewModel.collaborators.deactivate();
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
                return item.id === objectiveId;
            });
        }

        function titleUpdated(course) {
            if (course.id !== viewModel.id || viewModel.isEditing()) {
                return;
            }

            viewModel.title(course.title);
        }

        function introductionContentUpdated(course) {
            if (course.id !== viewModel.id) {
                return;
            }

            viewModel.courseIntroductionContent.originalText(course.introductionContent);
            if (!viewModel.courseIntroductionContent.isEditing()) {
                viewModel.courseIntroductionContent.text(course.introductionContent);
            }
        }

        function objectivesReordered(course) {
            if (viewModel.id !== course.id || viewModel.isReorderingObjectives()) {
                viewModel.isObjectivesListReorderedByCollaborator(true);
                return;
            }

            reorderConnectedObjectivesList(course);
        }

        function reorderConnectedObjectivesList(course) {
            viewModel.connectedObjectives(_.chain(course.objectives)
                  .map(function (objective) {
                      return _.find(viewModel.connectedObjectives(), function (obj) {
                          return obj.id === objective.id;
                      });
                  })
                  .value());
        }

        function objectiveConnected(courseId, objective, targetIndex) {
            if (viewModel.id !== courseId) {
                return;
            }

            var objectives = viewModel.connectedObjectives();
            var isConnected = _.some(objectives, function (item) {
                return item.id === objective.id;
            });

            if (isConnected) {
                objectives = _.reject(objectives, function (item) {
                    return item.id === objective.id;
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
                return objective.id === item.id;
            }));
        }

        function objectivesDisconnected(courseId, disconnectedObjectiveIds) {
            if (viewModel.id !== courseId) {
                return;
            }

            var connectedObjectives = viewModel.connectedObjectives();
            viewModel.connectedObjectives(_.reject(connectedObjectives, function (item) {
                return _.some(disconnectedObjectiveIds, function (id) {
                    return id === item.id;
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

        function updateCollaborationWarning() {
            if (userContext.identity.subscription.accessType === constants.accessType.free) {
                viewModel.collaborationWarning(localizationManager.localize('collaborationFreeWarning'));
            } else if (userContext.identity.subscription.accessType === constants.accessType.starter) {
                if (viewModel.collaborators.members().length > constants.maxStarterPlanCollaborators + 1) {
                    viewModel.collaborationWarning(localizationManager.localize('collaborationStarterWarning'));
                } else {
                    viewModel.collaborationWarning('');
                }
            } else {
                viewModel.collaborationWarning('');
            }
        }
    }
);