define(['routing/router', 'eventTracker', 'dataContext', 'userContext', 'repositories/questionRepository', 'localization/localizationManager', 'notify', 'widgets/dialog/viewmodel', 'constants'],
    function (router, eventTracker, dataContext, userContext, questionRepository, localizationManager, notify, dialog, constants) {
    'use strict';

    var events = {
        showDialog: 'Open move/copy question dialog',
        switchToMove: 'Switch to "move" item',
        switchToCopy: 'Switch to "copy" item',
        moveItem: 'Move item',
        copyItem: 'Copy item'
    };

    var viewModel = {
        courseId: '',
        questionId: '',
        sectionId: ko.observable(''),
        isContent: ko.observable(false),
        show: show,
        close:close,
        isCopy: ko.observable(true),
        changeMoveCopyAction: changeMoveCopyAction, 
        setCopyAction: setCopyAction,
        setMoveAction: setMoveAction,

        selectedCourse: ko.observable({}),
        selectCourse: selectCourse,
        selectedSectionId: ko.observable(''),
        selectSection: selectSection,
        courses: ko.observable({}),
        
        moveQuestion: moveQuestion,
        copyQuestion: copyQuestion,
        allSections: ko.observable({})
    };

    return viewModel;

    function show(courseId, sectionId, questionId, isContent) {
        eventTracker.publish(events.showDialog);
        dialog.show(viewModel, constants.dialogs.moveCopyQuestion.settings);
        reset(courseId, sectionId, questionId, isContent);
    }

    function close() {
        dialog.close();
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
            viewModel.selectedSectionId(null);
        } else {
            viewModel.selectedSectionId(course.sections[0].id);
        }
    }

    function selectSection(section) {
        viewModel.selectedSectionId(section.id);
    }

    function moveQuestion() {
        if (!isValidSection()) {
            return;
        }

        if (viewModel.sectionId() !== viewModel.selectedSectionId()) {
            eventTracker.publish(events.moveItem);
            questionRepository.moveQuestion(viewModel.questionId, viewModel.sectionId(), viewModel.selectedSectionId()).then(function () {
                viewModel.close();
                if (!_.isNullOrUndefined(viewModel.courseId)) {
                        router.navigate('courses/' + viewModel.courseId + '/sections/' + viewModel.sectionId());
                } else {
                        router.navigate('library/sections/' + viewModel.sectionId());
                }
            });
        } else {
            viewModel.close();
        }
    }

    function copyQuestion() {
        if (!isValidSection()) {
            return;
        }
        eventTracker.publish(events.copyItem);
        questionRepository.copyQuestion(viewModel.questionId, viewModel.selectedSectionId()).then(function (response) {
            viewModel.close();
        });
    }

    function reset(courseId, sectionId, questionId, isContent) {
        viewModel.isCopy(true);
        viewModel.courses(mapCourses());
        viewModel.courseId = courseId;
        viewModel.sectionId(sectionId);
        viewModel.questionId = questionId;
        viewModel.isContent(isContent);
        viewModel.selectedSectionId(viewModel.sectionId());
        viewModel.allSections({
            title: localizationManager.localize('allSections'),
            sections: dataContext.sections,
            objectvesListEmpty: dataContext.sections.length === 0
        });

        if (_.isNullOrUndefined(viewModel.courseId)) {
            viewModel.selectedCourse(viewModel.allSections());
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
                sections: course.sections,
                objectvesListEmpty: course.sections.length === 0
            };
                })
                .value();
    }

    function isValidSection() {
        var section;
        if (_.isNullOrUndefined(viewModel.selectedSectionId())) {
            notify.error(localizationManager.localize('moveCopyErrorMessage'));
            return false;
        }

        if (viewModel.selectedCourse() !== viewModel.allSections()) {
                var course = _.find(dataContext.courses, function (item) {
                return item.id === viewModel.selectedCourse().id;
            });

            if (_.isNullOrUndefined(course)) {
                notify.error(localizationManager.localize('courseIsNotAvailableAnyMore'));
                return false;
            }

                section = _.find(course.sections, function (item) {
                return item.id === viewModel.selectedSectionId();
            });
        } else {
            section = _.find(dataContext.sections, function (item) {
                return item.id === viewModel.selectedSectionId();
            });
        }

        if (_.isNullOrUndefined(section)) {
            notify.error(localizationManager.localize('sectionHasBeenDisconnectedByCollaborator'));
            return false;
        }

        return true;
    }
});