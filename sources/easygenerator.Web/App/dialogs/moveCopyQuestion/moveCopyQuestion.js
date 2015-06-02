define(['plugins/router', 'eventTracker', 'dataContext', 'userContext', 'repositories/questionRepository', 'localization/localizationManager', 'notify'],
    function (router, eventTracker, dataContext, userContext, questionRepository, localizationManager, notify) {
    'use strict';

    var events = {
        showDialog: 'Open move/copy question dialog',
        switchToMove: 'Switch to "move" item',
        switchToCopy: 'Switch to "copy" item',
        moveItem: 'Move item',
        copyItem: 'Copy item'
    };

    var viewModel = {
        isShown: ko.observable(false),
        courseId: '',
        questionId: '',
        objectiveId: ko.observable(''),
        show: show,
        hide: hide,
        isCopy: ko.observable(true),
        changeMoveCopyAction: changeMoveCopyAction, 
        setCopyAction: setCopyAction,
        setMoveAction: setMoveAction,

        selectedCourse: ko.observable({}),
        selectCourse: selectCourse,
        selectedObjectiveId: ko.observable(''),
        selectObjective: selectObjective,
        courses: ko.observable({}),
        
        moveQuestion: moveQuestion,
        copyQuestion: copyQuestion,
        allObjectives: ko.observable({})
    };

    return viewModel;

    function show(courseId, objectiveId, questionId) {
        eventTracker.publish(events.showDialog);
        viewModel.isShown(true);
        reset(courseId, objectiveId, questionId);
    }

    function hide() {
        viewModel.isShown(false);
    }

    function changeMoveCopyAction() {
        if (viewModel.isCopy()) {
            eventTracker.publish(events.switchToCopy);
        } else {
            eventTracker.publish(events.switchToMove);
        }
    }

    function setCopyAction() {
        if (viewModel.isCopy()) {
            return;
        }

        viewModel.isCopy(true);
        eventTracker.publish(events.switchToCopy);
    }

    function setMoveAction() {
        if (!viewModel.isCopy()) {
            return;
        }

        viewModel.isCopy(false);
        eventTracker.publish(events.switchToMove);
    }

    function selectCourse(course) {
        viewModel.selectedCourse(course);

        if (course.objectvesListEmpty) {
            viewModel.selectedObjectiveId(null);
        } else {
            viewModel.selectedObjectiveId(course.objectives[0].id);
        }
    }

    function selectObjective(objective) {
        viewModel.selectedObjectiveId(objective.id);
    }

    function moveQuestion() {
        if (!isValidObjective()) {
            return;
        }

        if (viewModel.objectiveId() !== viewModel.selectedObjectiveId()) {
            eventTracker.publish(events.moveItem);
            questionRepository.moveQuestion(viewModel.questionId, viewModel.objectiveId(), viewModel.selectedObjectiveId()).then(function () {
                viewModel.hide();
                if (!_.isNullOrUndefined(viewModel.courseId)) {
                        router.navigate('courses/' + viewModel.courseId + '/objectives/' + viewModel.objectiveId());
                } else {
                        router.navigate('library/objectives/' + viewModel.objectiveId());
                }
            });
        } else {
            viewModel.hide();
        }
    }

    function copyQuestion() {
        if (!isValidObjective()) {
            return;
        }
        eventTracker.publish(events.copyItem);
        questionRepository.copyQuestion(viewModel.questionId, viewModel.selectedObjectiveId()).then(function (response) {
            viewModel.hide();
            if (!_.isNullOrUndefined(viewModel.selectedCourse().id)) {
                    router.navigate('courses/' + viewModel.selectedCourse().id + '/objectives/' + viewModel.selectedObjectiveId() + '/questions/' + response.id);
            } else {
                    router.navigate('library/objectives/' + viewModel.selectedObjectiveId() + '/questions/' + response.id);
            }
        });
    }

    function reset(courseId, objectiveId, questionId) {
        viewModel.isCopy(true);
        viewModel.courses(mapCourses());
        viewModel.courseId = courseId;
        viewModel.objectiveId(objectiveId);
        viewModel.questionId = questionId;
        viewModel.selectedObjectiveId(viewModel.objectiveId());
        viewModel.allObjectives({
            title: localizationManager.localize('allObjectives'),
            objectives: dataContext.objectives,
            objectvesListEmpty: dataContext.objectives.length === 0
        });

        if (_.isNullOrUndefined(viewModel.courseId)) {
            viewModel.selectedCourse(viewModel.allObjectives());
        } else {
            viewModel.selectedCourse(_.find(viewModel.courses(), function (course) {
                return course.id == viewModel.courseId;
            }));
        }
    }

    function mapCourses() {
        return _.chain(dataContext.courses)
                .sortBy(function (course) {
                    return -course.createdOn;
                })
                .sortBy(function (course) {
                    return course.createdBy == userContext.identity.email ? 0 : 1;
                })
                .map(function (course) {
            return {
                id: course.id,
                title: course.title,
                objectives: course.objectives,
                objectvesListEmpty: course.objectives.length === 0
            };
                })
                .value();
    }

    function isValidObjective() {
        var objective;
        if (_.isNullOrUndefined(viewModel.selectedObjectiveId())) {
            notify.error(localizationManager.localize('moveCopyErrorMessage'));
            return false;
        }

        if (viewModel.selectedCourse() !== viewModel.allObjectives()) {
                var course = _.find(dataContext.courses, function (item) {
                return item.id === viewModel.selectedCourse().id;
            });

            if (_.isNullOrUndefined(course)) {
                notify.error(localizationManager.localize('courseIsNotAvailableAnyMore'));
                return false;
            }

                objective = _.find(course.objectives, function (item) {
                return item.id === viewModel.selectedObjectiveId();
            });
        } else {
            objective = _.find(dataContext.objectives, function (item) {
                return item.id === viewModel.selectedObjectiveId();
            });
        }

        if (_.isNullOrUndefined(objective)) {
            notify.error(localizationManager.localize('learningObjectiveHasBeenDisconnectedByCollaborator'));
            return false;
        }

        return true;
    }
});