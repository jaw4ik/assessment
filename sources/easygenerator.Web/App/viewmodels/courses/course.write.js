define(['plugins/router', 'constants', 'eventTracker', 'repositories/courseRepository', 'services/publishService',
    'viewmodels/objectives/objectiveBrief', 'localization/localizationManager', 'notify', 'repositories/objectiveRepository',
    'viewmodels/common/contentField', 'viewmodels/courses/collaboration/collaborators', 'viewmodels/common/contentField', 'userContext'],
    function (router, constants, eventTracker, courseRepository, service,
        objectiveBriefViewModel, localizationManager, notify, objectiveRepository,
        vmContentField, collaboratorsViewModel, contentFieldViewModel, userContext) {
        "use strict";

        var
            events = {
                selectObjective: 'Select Objective',
                unselectObjective: 'Unselect Objective',
                updateCourseTitle: 'Update course title',
                showAllAvailableObjectives: 'Show all available objectives',
                connectSelectedObjectivesToCourse: 'Connect selected objectives to course',
                showConnectedObjectives: 'Show connected objectives',
                unrelateObjectivesFromCourse: 'Unrelate objectives from course',
                changeOrderObjectives: 'Change order of learning objectives',
                navigateToObjectiveDetails: 'Navigate to objective details',
                navigateToCreateObjective: 'Navigate to create objective'
            };

        var eventsForCourseContent = {
            addContent: 'Define introduction',
            beginEditText: 'Start editing introduction',
            endEditText: 'End editing introduction'
        };

        var objectivesListModes = {
            appending: 'appending',
            display: 'display'
        };

        var viewModel = {
            objectivesListModes: objectivesListModes,

            id: '',
            title: ko.observable(''),
            originalTitle: '',
            connectedObjectives: ko.observableArray([]),
            availableObjectives: ko.observableArray([]),
            courseIntroductionContent: {},
            collaborators: null,
            isEditing: ko.observable(false),
            courseTitleMaxLength: constants.validation.courseTitleMaxLength,
            objectivesMode: ko.observable(objectivesListModes.display),

            initialize: initialize,
            navigateToObjectiveDetails: navigateToObjectiveDetails,
            navigateToCreateObjective: navigateToCreateObjective,
            toggleObjectiveSelection: toggleObjectiveSelection,
            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,
            showAllAvailableObjectives: showAllAvailableObjectives,
            showConnectedObjectives: showConnectedObjectives,
            disconnectSelectedObjectives: disconnectSelectedObjectives,
            reorderObjectives: reorderObjectives,
            connectObjective: connectObjective,
            disconnectObjective: disconnectObjective
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
            return viewModel.connectedObjectives().length != 1;
        });

        return viewModel;

        function initialize(course) {
            viewModel.id = course.id;
            viewModel.title(course.title);
            viewModel.originalTitle = course.title;
            viewModel.isEditing(false);
            viewModel.objectivesMode(objectivesListModes.display);
            viewModel.courseIntroductionContent = course.introductionContent;

            viewModel.collaborators = new collaboratorsViewModel(course.id, course.createdBy, course.collaborators);

            viewModel.courseIntroductionContent = contentFieldViewModel(course.introductionContent, eventsForCourseContent, false, function (content) {
                return courseRepository.updateIntroductionContent(course.id, content);
            });

            viewModel.connectedObjectives(_.chain(course.objectives).map(function (objective) {
                return objectiveBriefViewModel(objective);
            }).value());
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
            viewModel.originalTitle = viewModel.title();
            viewModel.isEditing(true);
        }

        function endEditTitle() {
            viewModel.title(viewModel.title().trim());
            if (viewModel.title.isValid() && viewModel.title() != viewModel.originalTitle) {
                eventTracker.publish(events.updateCourseTitle);
                courseRepository.updateCourseTitle(viewModel.id, viewModel.title()).then(notify.saved);
            } else {
                viewModel.title(viewModel.originalTitle);
            }
            viewModel.isEditing(false);
        }

        function showAllAvailableObjectives() {
            if (viewModel.objectivesMode() == objectivesListModes.appending) {
                return;
            }

            eventTracker.publish(events.showAllAvailableObjectives);
            objectiveRepository.getCollection().then(function (objectivesList) {
                var relatedIds = _.pluck(viewModel.connectedObjectives(), 'id');

                viewModel.availableObjectives(_.chain(objectivesList).filter(function (item) {
                    return !_.include(relatedIds, item.id) && item.createdBy == userContext.identity.email;
                }).sortBy(function (item) {
                    return -item.createdOn;
                }).map(function (item) {
                    var mappedObjective = objectiveBriefViewModel(item);
                    mappedObjective._original = item;
                    return mappedObjective;
                }).value());

                viewModel.objectivesMode(objectivesListModes.appending);
            });
        }

        function showConnectedObjectives() {
            if (viewModel.objectivesMode() == objectivesListModes.display) {
                return;
            }

            eventTracker.publish(events.showConnectedObjectives);

            _.each(viewModel.connectedObjectives(), function (item) {
                item.isSelected(false);
            });

            viewModel.objectivesMode(objectivesListModes.display);
        }

        function disconnectSelectedObjectives() {
            if (!viewModel.canDisconnectObjectives()) {
                return;
            }

            eventTracker.publish(events.unrelateObjectivesFromCourse);

            var that = viewModel,
                selectedObjectives = _.filter(viewModel.connectedObjectives(), function (item) {
                    return item.isSelected();
                });

            courseRepository.unrelateObjectives(viewModel.id, selectedObjectives).then(function () {
                that.connectedObjectives(_.difference(that.connectedObjectives(), selectedObjectives));
                notify.saved();
            });
        }

        function reorderObjectives() {
            eventTracker.publish(events.changeOrderObjectives);
            courseRepository.updateObjectiveOrder(viewModel.id, viewModel.connectedObjectives()).then(function () {
                notify.saved();
            });
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
                courseRepository.updateObjectiveOrder(viewModel.id, objectives).then(function () {
                    notify.saved();
                });
                return;
            }

            eventTracker.publish(events.connectSelectedObjectivesToCourse);
            courseRepository.relateObjective(viewModel.id, objective.item, objective.targetIndex).then(function () {
                notify.saved();
            });
        }

        function disconnectObjective(objective) {
            if (_.contains(viewModel.availableObjectives(), objective.item)) {
                return;
            }
            eventTracker.publish(events.unrelateObjectivesFromCourse);
            courseRepository.unrelateObjectives(viewModel.id, [objective.item]).then(function () {
                notify.saved();
            });
        }
    }

);