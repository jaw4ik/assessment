define(['plugins/router', 'plugins/dialog', 'eventTracker', 'dataContext'], function (router, dialog, eventTracker, dataContext) {
    'use strict';

    var allObjectives = {
        id: 'asdasd',
        title: 'All objective',
        objectives: dataContext.objectives
    };

    var events = {
        showDialog: 'Open move/copy question dialog',
        switchToMove: 'Switch to "move" item',
        switchToCopy: 'Switch to "copy" item',
        moveItem: 'Move item',
        copyItem: 'Copy item'
    };

    var moveCopyQuestionDialog = {
        isShown: ko.observable(false),
        show: show,
        hide: hide,
        isCopy: ko.observable(true),
        changeMoveCopyAction: changeMoveCopyAction,

        selectedCourse: ko.observable({}),
        selectCourse: selectCourse,
        selectedObjective: ko.observable({}),
        selectObjective: selectObjective,
        courses: ko.observable({}),
        objectives: dataContext.objectives,
        
        moveQuestion: moveQuestion,
        copyQuestion: copyQuestion,
    };

    return moveCopyQuestionDialog;

    function show() {
        eventTracker.publish(events.showDialog);
        moveCopyQuestionDialog.isShown(true);
        moveCopyQuestionDialog.courses(getCourses());
        moveCopyQuestionDialog.selectedCourse(_.find(moveCopyQuestionDialog.courses(), function (course) {
            return course.id == router.routeData().courseId;
        }));
        moveCopyQuestionDialog.selectedObjective(router.routeData().objectiveId);
    }

    function hide() {
        moveCopyQuestionDialog.isShown(false);
    }

    function changeMoveCopyAction() {
        if (moveCopyQuestionDialog.isCopy()) {
            eventTracker.publish(events.switchToCopy);
        } else {
            eventTracker.publish(events.switchToMove);
        }
    }

    function selectCourse(course) {
        moveCopyQuestionDialog.selectedCourse(course);
    }

    function selectObjective(objective) {
        moveCopyQuestionDialog.selectedObjective(objective.id);
    }

    function moveQuestion() {
        eventTracker.publish(events.moveItem);
    }

    function copyQuestion() {
        eventTracker.publish(events.copyItem);
    }

    function getCourses() {
        var courses = [],
            courseId =router.routeData().courseId;
        if (!_.isNullOrUndefined(courseId)) {
            courses = _.map(dataContext.courses, function(course) {
                return {
                    id: course.id,
                    title: course.title,
                    objectives: course.objectives
                };
            });
        }

        courses.push(allObjectives);

        return courses;
    }

});