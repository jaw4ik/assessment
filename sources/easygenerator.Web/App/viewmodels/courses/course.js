define(['plugins/router', 'constants', 'eventTracker', 'repositories/courseRepository', 'services/deliverService', 'viewmodels/objectives/objectiveBrief',
        'localization/localizationManager', 'notify', 'repositories/objectiveRepository', 'viewmodels/common/contentField', 'clientContext', 'controls/backButton/backButton'],
    function (router, constants, eventTracker, repository, service, objectiveBrief, localizationManager, notify, objectiveRepository, vmContentField, clientContext, backButton) {
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
            originalTitle: '',
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
            connectObjectives: connectObjectives,
            courseTitleMaxLength: constants.validation.courseTitleMaxLength,
            disconnectSelectedObjectives: disconnectSelectedObjectives,
            reorderObjectives: reorderObjectives,
            isSortingEnabled: ko.observable(true),
            activate: activate
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
            viewModel.originalTitle = viewModel.title();
            viewModel.isEditing(true);
        }
        function endEditTitle() {
            viewModel.title(viewModel.title().trim());
            if (viewModel.title.isValid() && viewModel.title() != viewModel.originalTitle) {
                eventTracker.publish(events.updateCourseTitle);
                repository.updateCourseTitle(viewModel.id, viewModel.title()).then(notify.saved);
            } else {
                viewModel.title(viewModel.originalTitle);
            }
            viewModel.isEditing(false);
        }

        function showAllAvailableObjectives() {
            if (viewModel.objectivesMode() == viewModel.objectivesListModes.appending) {
                return;
            }

            eventTracker.publish(events.showAllAvailableObjectives);

            var that = viewModel;

            objectiveRepository.getCollection().then(function (objectivesList) {
                var relatedIds = _.pluck(that.connectedObjectives(), 'id');

                viewModel.availableObjectives(_.chain(objectivesList)
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

                that.objectivesMode(viewModel.objectivesListModes.appending);
            });
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

        function connectObjectives() {
            eventTracker.publish(events.connectSelectedObjectivesToCourse);
            var that = viewModel;

            var objectivesToRelate = _.chain(that.availableObjectives()).filter(function (item) {
                return item.isSelected();
            }).pluck('_original').value();

            if (objectivesToRelate.length == 0) {
                return;
            }

            repository.relateObjectives(that.id, objectivesToRelate).then(function (response) {
                that.connectedObjectives(_.chain(that.connectedObjectives()).union(response.relatedObjectives).map(function (item) {
                    return objectiveBrief(item);
                }).value());

                that.availableObjectives(that.availableObjectives().filter(function (item) {
                    return !_.contains(response.relatedObjectives, item._original);
                }));

                notify.saved();

                if (objectivesToRelate.length != response.relatedObjectives.length) {
                    notify.error(localizationManager.localize('objectivesNotFoundError'));
                }
            });
        }

        function disconnectSelectedObjectives() {
            eventTracker.publish(events.unrelateObjectivesFromCourse);

            var that = viewModel,
                selectedObjectives = _.filter(viewModel.connectedObjectives(), function (item) {
                    return item.isSelected();
                });

            repository.unrelateObjectives(viewModel.id, _.map(selectedObjectives, function (item) { return item; }))
                .then(function (modifiedOn) {
                    that.connectedObjectives(_.difference(that.connectedObjectives(), selectedObjectives));
                    notify.saved();
                });
        }

        function reorderObjectives() {
            eventTracker.publish(events.changeOrderObjectives);
            repository.updateObjectiveOrder(viewModel.id, viewModel.connectedObjectives()).then(function () {
                notify.saved();
            });
        }

        function activate(courseId) {
            viewModel.language(localizationManager.currentLanguage);

            var goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('courses');
            backButton.enable(goBackTooltip, 'courses', navigateToCoursesEvent);

            var that = viewModel;
            return repository.getById(courseId).then(function (course) {
                that.id = course.id;

                clientContext.set('lastVistedCourse', course.id);
                clientContext.set('lastVisitedObjective', null);

                that.title(course.title);
                that.originalTitle = course.title;
                that.objectivesMode(that.objectivesListModes.display);
                that.connectedObjectives(_.chain(course.objectives)
                    .map(function (objective) {
                        return objectiveBrief(objective);
                    })
                    .value());

                viewModel.isEditing(false);
                that.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, function (content) { return repository.updateIntroductionContent(course.id, content); });
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        };
    }
);