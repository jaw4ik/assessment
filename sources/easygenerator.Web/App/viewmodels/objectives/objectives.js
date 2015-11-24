define(['durandal/app', 'constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository', 'repositories/courseRepository', 'notify', 'localization/localizationManager',
    'clientContext', 'userContext', 'viewmodels/objectives/objectiveBrief', 'imageUpload','commands/createObjectiveCommand'],
    function (app, constants, eventTracker, router, objectiveRepository, courseRepository, notify, localizationManager, clientContext, userContext, objectiveBrief, imageUpload, createObjectiveCommand) {
        "use strict";

        var
            events = {
                navigateToDetails: "Navigate to objective details",
                navigateToCourses: "Navigate to courses",
                selectObjective: "Select Objective",
                unselectObjective: "Unselect Objective",
                deleteObjectives: "Delete selected objectives",
                openChangeObjectiveImageDialog: "Open \"change objective image\" dialog",
                changeObjectiveImage: "Change objective image"
            };

        var viewModel = {
            objectives: ko.observableArray([]),

            lastVisitedObjective: '',
            currentLanguage: '',

            createObjective: createObjective,
            navigateToDetails: navigateToDetails,
            navigateToCourses: navigateToCourses,

            deleteSelectedObjectives: deleteSelectedObjectives,
            toggleObjectiveSelection: toggleObjectiveSelection,

            updateObjectiveImage: updateObjectiveImage,

            objectiveTitleUpdated: objectiveTitleUpdated,
            objectiveImageUpdated: objectiveImageUpdated,

            activate: activate
        };

        viewModel.enableDeleteObjectives = ko.computed(function () {
            return getSelectedObjectives().length > 0;
        });

        app.on(constants.messages.objective.titleUpdatedByCollaborator, viewModel.objectiveTitleUpdated);
        app.on(constants.messages.objective.imageUrlUpdatedByCollaborator, viewModel.objectiveImageUpdated);

        return viewModel;

        function createObjective() {
            createObjectiveCommand.execute();
        }

        function navigateToDetails(item) {
            eventTracker.publish(events.navigateToDetails);
            router.navigate('library/objectives/' + item.id);
        }

        function navigateToCourses() {
            eventTracker.publish(events.navigateToCourses);
            router.navigate('courses');
        }

        function updateObjectiveImage(objective) {
            eventTracker.publish(events.openChangeObjectiveImageDialog);
            imageUpload.upload({
                startLoading: function () {
                    objective.isImageLoading(true);
                },
                success: function (url) {
                    objectiveRepository.updateImage(objective.id, url).then(function (result) {
                        objective.imageUrl(result.imageUrl);
                        objective.modifiedOn(result.modifiedOn);
                        objective.isImageLoading(false);
                        eventTracker.publish(events.changeObjectiveImage);
                        notify.saved();
                    });
                },
                error: function () {
                    objective.isImageLoading(false);
                }
            });
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

        function objectiveTitleUpdated(objective) {
            var vmObjective = getObjectiveViewModel(objective.id);

            if (_.isObject(vmObjective)) {
                vmObjective.title(objective.title);
                vmObjective.modifiedOn(objective.modifiedOn);
            }
        }

        function objectiveImageUpdated(objective) {
            var vmObjective = getObjectiveViewModel(objective.id);

            if (_.isObject(vmObjective)) {
                vmObjective.imageUrl(objective.image);
                vmObjective.modifiedOn(objective.modifiedOn);
            }
        }

        function getObjectiveViewModel(objectiveId) {
            return _.find(viewModel.objectives(), function (item) {
                return item.id === objectiveId;
            });
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
                            var mappedObjective = objectiveBrief(item);
                            mappedObjective.canBeDeleted = (function (currentItem) {
 
                                return (!_.find(includedObjectives, function (objective) {
                                    return objective.id === currentItem.id;
                                }));
                            })(item);
                            return mappedObjective;
                        }).value();

                    viewModel.objectives(array);
                });
            });
        };


    });