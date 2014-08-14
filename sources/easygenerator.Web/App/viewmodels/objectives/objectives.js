define(['constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/courseRepository', 'notify', 'localization/localizationManager', 'clientContext', 'ping', 'userContext'],
    function (constants, eventTracker, router, objectiveRepository, courseRepository, notify, localizationManager, clientContext, ping, userContext) {
        "use strict";

        var
            events = {
                navigateToCreation: "Navigate to create objective",
                navigateToDetails: "Navigate to objective details",
                navigateToCourses: "Navigate to courses",
                selectObjective: "Select Objective",
                unselectObjective: "Unselect Objective",
                deleteObjectives: "Delete selected objectives"
            };

        var viewModel = {
            objectives: ko.observableArray([]),

            lastVisitedObjective: '',
            currentLanguage: '',

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToCourses: navigateToCourses,

            deleteSelectedObjectives: deleteSelectedObjectives,
            toggleObjectiveSelection: toggleObjectiveSelection,

            canActivate: canActivate,
            activate: activate
        };

        viewModel.enableDeleteObjectives = ko.computed(function () {
            return getSelectedObjectives().length > 0;
        });

        return viewModel;

        function navigateToCreation() {
            eventTracker.publish(events.navigateToCreation);
            router.navigate('objective/create');
        }

        function navigateToDetails(item) {
            eventTracker.publish(events.navigateToDetails);
            router.navigate('objective/' + item.id);
        }

        function navigateToCourses() {
            eventTracker.publish(events.navigateToCourses);
            router.navigate('courses');
        }

        function toggleObjectiveSelection(objective) {
            if (_.isNullOrUndefined(objective)) {
                throw 'Objective is null or undefined';
            }

            if (!ko.isObservable(objective.isSelected)) {
                throw 'Objective does not have isSelected observable';
            }

            objective.isSelected(!objective.isSelected());
            eventTracker.publish(objective.isSelected() ? events.selectObjective : events.unselectObjective);
        }

        function getSelectedObjectives() {
            return _.reject(viewModel.objectives(), function (objective) {
                return objective.isSelected && !objective.isSelected();
            });
        }

        function deleteSelectedObjectives() {
            eventTracker.publish(events.deleteObjectives);

            var selectedObjectives = getSelectedObjectives();
            if (selectedObjectives.length == 0) {
                throw "No selected objectives to delete";
            }

            if (selectedObjectives.length > 1) {
                notify.error(localizationManager.localize('deleteSeveralObjectivesError'));
                return undefined;
            }

            var selectedObjective = selectedObjectives[0];

            if (!selectedObjective.canBeDeleted) {
                notify.error(localizationManager.localize('objectiveCannnotBeDeleted'));
                return undefined;
            }

            objectiveRepository.removeObjective(selectedObjective.id).then(function () {
                viewModel.objectives(_.reject(viewModel.objectives(), function (objective) {
                    return objective.id === selectedObjective.id;
                }));
                notify.saved();
            });
        }

        function canActivate() {
            return ping.execute();
        }

        function activate() {

            viewModel.lastVisitedObjective = clientContext.get(constants.clientContextKeys.lastVisitedObjective);
            clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);

            viewModel.currentLanguage = localizationManager.currentLanguage;

            return objectiveRepository.getCollection().then(function (receivedObjectives) {
                return courseRepository.getCollection().then(function (courses) {
                    var includedObjectives = _.chain(courses).map(function (course) {
                        return course.objectives;
                    }).flatten().uniq().value();
                    var array = _.chain(receivedObjectives)
                        .filter(function (item) { return item.createdBy == userContext.identity.email; })
                        .sortBy(function (item) { return -item.createdOn; })
                        .map(function (item) {
                            return {
                                id: item.id,
                                title: item.title,
                                image: item.image,
                                questionsCount: item.questions.length,
                                modifiedOn: item.modifiedOn,
                                isSelected: ko.observable(false),
                                canBeDeleted: (function (currentItem) {
                                    if (item.questions.length > 0)
                                        return false;

                                    return (!_.find(includedObjectives, function (objective) {
                                        return objective.id === currentItem.id;
                                    }));
                                })(item)
                            };
                        }).value();

                    viewModel.objectives(array);
                });
            });
        };


    });