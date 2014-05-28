define(['commands/createQuestionCommand', 'plugins/router', 'constants', 'userContext'], function (createQuestionCommand, router, constants, userContext) {

    "use strict";

    var viewModel = {
        objectiveId: null,
        eventCategory: null,
        visible: ko.observable(false),
        hasStarterAccess: ko.observable(userContext.hasStarterAccess()),

        activate: activate,
        show: show,
        hide: hide,
        createMultipleChoiceQuestion: createMultipleChoiceQuestion,
        createFillInTheBlankQuestion: createFillInTheBlankQuestion,
        createDragAndDropQuestion: createDragAndDropQuestion
    };

    return viewModel;

    function activate(settings) {
        viewModel.objectiveId = settings.objectiveId;
        viewModel.eventCategory = settings.eventCategory;

        return userContext.identify().then(function() {
            viewModel.hasStarterAccess(userContext.hasStarterAccess());
        });
    }

    function show() {
       viewModel.visible(!this.visible());
    }

    function hide() {
        viewModel.visible(false);
    }

    function createMultipleChoiceQuestion() {
        var courseId = getCourseId();
        viewModel.visible(false);
        return createQuestionCommand.execute(viewModel.objectiveId, courseId, constants.questionType.multipleChoice.type);
    }

    function createFillInTheBlankQuestion() {
        var courseId = getCourseId();
        viewModel.visible(false);
        return createQuestionCommand.execute(viewModel.objectiveId, courseId, constants.questionType.fillInTheBlank.type);
    }

    function createDragAndDropQuestion() {
        var courseId = getCourseId();
        viewModel.visible(false);
        return createQuestionCommand.execute(viewModel.objectiveId, courseId, constants.questionType.dragAndDrop.type);
    }

    function getCourseId() {
        var params = router.activeInstruction().queryParams;
        return  _.isNullOrUndefined(params) ? null : params.courseId;
    }

});