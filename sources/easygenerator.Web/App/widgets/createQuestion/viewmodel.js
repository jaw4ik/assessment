define(['commands/createQuestionCommand', 'plugins/router', 'constants', 'userContext'],
    function (createQuestionCommand, router, constants, userContext) {

    "use strict";

    var viewModel = {
        objectiveId: null,
        eventCategory: null,
        visible: ko.observable(false),
        hasStarterAccess: ko.observable(false),
        hasPlusAccess: ko.observable(false),

        activate: activate,
        show: show,
        hide: hide,
        createMultipleSelectQuestion: createMultipleSelectQuestion,
        createFillInTheBlankQuestion: createFillInTheBlankQuestion,
        createDragAndDropQuestion: createDragAndDropQuestion,
        createMultipleChoiceQuestion: createMultipleChoiceQuestion
    };

    return viewModel;

    function activate(settings) {
        viewModel.objectiveId = settings.objectiveId;
        viewModel.eventCategory = settings.eventCategory;

        return userContext.identify().then(function() {
            viewModel.hasStarterAccess(userContext.hasStarterAccess());
            viewModel.hasPlusAccess(userContext.hasPlusAccess());
        });
    }

    function show() {
        viewModel.visible(!viewModel.visible());
    }

    function hide() {
        viewModel.visible(false);
    }

    function createMultipleSelectQuestion() {
        create(constants.questionType.multipleSelect.type);
    }

    function createFillInTheBlankQuestion() {
        create(constants.questionType.fillInTheBlank.type);
    }

    function createDragAndDropQuestion() {
        create(constants.questionType.dragAndDrop.type);
    }

    function createMultipleChoiceQuestion() {
        create(constants.questionType.multipleChoice.type);
    }

    function create(type) {
        var courseId = getCourseId();
        viewModel.visible(false);
        return createQuestionCommand.execute(viewModel.objectiveId, courseId, type);
    }

    function getCourseId() {
        var params = router.activeInstruction().queryParams;
        return  _.isNullOrUndefined(params) ? null : params.courseId;
    }

});