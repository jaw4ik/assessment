define(['guard', 'commands/createQuestionCommand', 'plugins/router', 'constants', 'userContext', 'eventTracker'], function (guard, createQuestionCommand, router, constants, userContext, eventTracker) {

    "use strict";

    var viewModel = {
        objectiveId: null,
        questions: ko.observableArray([]),

        activate: activate,
        createQuestion: createQuestion,
        openUpgradePlanUrl: openUpgradePlanUrl
    };

    return viewModel;

    function activate(settings) {
        guard.throwIfNotAnObject(settings, 'settings is not an object');
        guard.throwIfNotString(settings.objectiveId, 'objectiveId is not a string');

        viewModel.objectiveId = settings.objectiveId;

        return userContext.identify().then(function () {
            viewModel.questions([
                {
                    type: constants.questionType.informationContent.type,
                    hasAccess: true
                },
                {
                    type: constants.questionType.singleSelectText.type,
                    hasAccess: true
                },
                {
                    type: constants.questionType.multipleSelect.type,
                    hasAccess: true
                },
                {
                    type: constants.questionType.singleSelectImage.type,
                    hasAccess: userContext.hasStarterAccess()
                },
                {
                    type: constants.questionType.fillInTheBlank.type,
                    hasAccess: userContext.hasStarterAccess()
                },
                {
                    type: constants.questionType.textMatching.type,
                    hasAccess: userContext.hasStarterAccess()
                },
                {
                    type: constants.questionType.dragAndDropText.type,
                    hasAccess: userContext.hasPlusAccess()
                },
                {
                    type: constants.questionType.statement.type,
                    hasAccess: userContext.hasPlusAccess()
                },
                {
                    type: constants.questionType.hotspot.type,
                    hasAccess: userContext.hasPlusAccess()
                }
            ]);
        });
    }

    function openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.questions);
        router.openUrl(constants.upgradeUrl);
    }

    function createQuestion(item) {
        var courseId = getCourseId();
        return createQuestionCommand.execute(viewModel.objectiveId, courseId, item.type);
    }

    function getCourseId() {
        var params = router.activeInstruction().queryParams;
        return _.isNullOrUndefined(params) ? null : params.courseId;
    }

});