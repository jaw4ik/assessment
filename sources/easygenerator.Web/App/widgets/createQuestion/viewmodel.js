define(['commands/createQuestionCommand', 'plugins/router', 'constants'], function (createQuestionCommand, router, constants) {

    "use strict";

    var createQuestionWidget = function () { };

    createQuestionWidget.prototype.visible = ko.observable(false);

    createQuestionWidget.prototype.activate = function (settings) {
        createQuestionWidget.prototype.objectiveId = settings.objectiveId;
        createQuestionWidget.prototype.eventCategory = settings.eventCategory;
    };

    createQuestionWidget.prototype.toggleVisible = function() {
       this.visible(!this.visible());
    };

    createQuestionWidget.prototype.hide = function() {
        createQuestionWidget.prototype.visible(false);
    };

    createQuestionWidget.prototype.createMultipleChoiceQuestion = function() {
        var courseId = getCourseId();
        this.visible(false);
        return createQuestionCommand.execute(this.objectiveId, courseId, constants.questionType.multipleChoice.type);
    };

    createQuestionWidget.prototype.createFillInTheBlankQuestion = function () {
        var courseId = getCourseId();
        this.visible(false);
        return createQuestionCommand.execute(this.objectiveId, courseId, constants.questionType.fillInTheBlank.type);
    };

    function getCourseId() {
        var params = router.activeInstruction().queryParams;
        return  _.isNullOrUndefined(params) ? null : params.courseId;
    }

    return createQuestionWidget;

});