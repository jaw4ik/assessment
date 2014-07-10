define(['guard', 'commands/createQuestionCommand', 'plugins/router', 'constants', 'userContext'], function (guard, createQuestionCommand, router, constants, userContext) {

    "use strict";

    var viewModel = {
        objectiveId: null,
        visible: ko.observable(false),
        questions: ko.observableArray([]),

        activate: activate,
        show: show,
        hide: hide,
        createQuestion: createQuestion
    };

    return viewModel;

    function activate(settings) {
        guard.throwIfNotAnObject(settings, 'settings is not an object');
        guard.throwIfNotString(settings.objectiveId, 'objectiveId is not a string');

        viewModel.objectiveId = settings.objectiveId;

        return userContext.identify().then(function () {
            viewModel.questions([
                {
                    type: constants.questionType.singleSelectText.type,
                    name: constants.questionType.singleSelectText.name,
                    hasAccess: true
                },
                {
                    type: constants.questionType.multipleSelect.type,
                    name: constants.questionType.multipleSelect.name,
                    hasAccess: true
                },
                {
                    type: constants.questionType.fillInTheBlank.type,
                    name: constants.questionType.fillInTheBlank.name,
                    hasAccess: userContext.hasStarterAccess()
                },
                {
                    type: constants.questionType.dragAndDropText.type,
                    name: constants.questionType.dragAndDropText.name,
                    hasAccess: userContext.hasPlusAccess()
                }
            ]);
        });
    }

    function show() {
        viewModel.visible(!viewModel.visible());
    }

    function hide() {
        viewModel.visible(false);
    }

    function createQuestion(item) {
        var courseId = getCourseId();
        viewModel.visible(false);
        return createQuestionCommand.execute(viewModel.objectiveId, courseId, item.type);
    }

    function getCourseId() {
        var params = router.activeInstruction().queryParams;
        return _.isNullOrUndefined(params) ? null : params.courseId;
    }

});