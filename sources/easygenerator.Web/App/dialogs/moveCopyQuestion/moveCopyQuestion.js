define(['plugins/router', 'eventTracker', 'dataContext', 'repositories/questionRepository', 'localization/localizationManager', 'notify'],
    function (router, eventTracker, dataContext, questionRepository, localizationManager, notify) {
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
        objectiveId: '',
        show: show,
        hide: hide,
        isCopy: ko.observable(true),
        changeMoveCopyAction: changeMoveCopyAction, 

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
        if (_.isNullOrUndefined(viewModel.selectedObjectiveId())) {
            notify.error(localizationManager.localize('moveCopyErrorMessage'));
            return;
        }
        if (viewModel.objectiveId !== viewModel.selectedObjectiveId()) {
            eventTracker.publish(events.moveItem);
            questionRepository.moveQuestion(viewModel.questionId, viewModel.objectiveId, viewModel.selectedObjectiveId()).then(function () {
                viewModel.hide();
                if (!_.isNullOrUndefined(viewModel.courseId)) {
                    router.navigate('objective/' + viewModel.objectiveId + '?courseId=' + viewModel.courseId);
                } else {
                    router.navigate('objective/' + viewModel.objectiveId);
                }
            });
        } else {
            viewModel.hide();
        }
    }

    function copyQuestion() {
        if (_.isNullOrUndefined(viewModel.selectedObjectiveId())) {
            notify.error(localizationManager.localize('moveCopyErrorMessage'));
            return;
        }
        eventTracker.publish(events.copyItem);
        questionRepository.copyQuestion(viewModel.questionId, viewModel.selectedObjectiveId()).then(function (response) {
            viewModel.hide();
            if (!_.isNullOrUndefined(viewModel.courseId)) {
                router.navigate('objective/' + viewModel.selectedObjectiveId() + '/question/' + response.id + '?courseId=' + viewModel.courseId);
            } else {
                router.navigate('objective/' + viewModel.selectedObjectiveId() + '/question/' + response.id);
            }
        });
    }

    function reset(courseId, objectiveId, questionId) {
        viewModel.isCopy(true);
        viewModel.courses(mapCourses());
        viewModel.courseId = courseId;
        viewModel.objectiveId = objectiveId;
        viewModel.questionId = questionId;
        viewModel.selectedObjectiveId(viewModel.objectiveId);
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
        return _.map(dataContext.courses, function (course) {
            return {
                id: course.id,
                title: course.title,
                objectives: course.objectives,
                objectvesListEmpty: course.objectives.length === 0
            };
        });
    }
});