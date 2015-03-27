define(['plugins/router', 'eventTracker', 'dataContext', 'repositories/questionRepository', 'localization/localizationManager'],
    function (router, eventTracker, dataContext, questionRepository, localizationManager) {
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
        selectedObjective: ko.observable(''),
        selectObjective: selectObjective,
        courses: ko.observable(dataContext.courses),
        
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
        if (!_.isNullOrUndefined(course.id)) {
            viewModel.allObjectives().isSelected(false);
            viewModel.selectedCourse(course);
        } else {
            viewModel.allObjectives().isSelected(true);
            viewModel.selectedCourse(viewModel.allObjectives());
        }
    }

    function selectObjective(objective) {
        viewModel.selectedObjective(objective.id);
    }

    function moveQuestion() {
        if (viewModel.objectiveId !== viewModel.selectedObjective()) {
            eventTracker.publish(events.moveItem);
            questionRepository.moveQuestion(viewModel.questionId, viewModel.objectiveId, viewModel.selectedObjective()).then(function(response) {
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
        eventTracker.publish(events.copyItem);
        questionRepository.copyQuestion(viewModel.questionId, viewModel.selectedObjective()).then(function (response) {
            viewModel.hide();
            if (!_.isNullOrUndefined(viewModel.courseId)) {
                router.navigate('objective/' + viewModel.selectedObjective() + '/question/' + response.id + '?courseId=' + viewModel.courseId);
            } else {
                router.navigate('objective/' + viewModel.selectedObjective() + '/question/' + response.id);
            }
        });
    }

    function reset(courseId, objectiveId, questionId) {
        viewModel.isCopy(true);
        viewModel.courses(mapCourses());
        viewModel.courseId = courseId;
        viewModel.objectiveId = objectiveId;
        viewModel.questionId = questionId;
        viewModel.selectedObjective(viewModel.objectiveId);
        viewModel.allObjectives({
            title: localizationManager.localize('allObjectives'),
            objectives: ko.observable(dataContext.objectives),
            isSelected: ko.observable(false)
        });

        if (_.isNullOrUndefined(viewModel.courseId)) {
            viewModel.selectedCourse(viewModel.allObjectives());
            viewModel.allObjectives().isSelected(true);
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