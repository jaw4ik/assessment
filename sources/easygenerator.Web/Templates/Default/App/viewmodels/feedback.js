define(['context', 'durandal/plugins/router'], function (context, router) {

    var
        score = null,
        objective = null,
        question = null,
        backToObjectives = function () {
            router.navigateTo('#/');
        },
        showExplanations = function () {
            router.navigateTo('#/objective/' + objective.id + '/question/' + question.id + '/explanations');
        },
        isShowNextQuestionButton = function () {
            return this.score == 100;
        },
        isShowTryAgainButton = function () {
            return this.score < 100;
        },
        chooseNextQuestion = function () {
            router.navigateTo('#/');
        },
        tryAgain = function () {
            router.navigateTo('#/objective/' + objective.id + '/question/' + question.id );
        },
        activate = function (routeData) {
            objective = _.find(context.objectives, function (item) {
                return item.id == routeData.objectiveId;
            });

            question = _.find(objective.questions, function (item) {
                return item.id == routeData.questionId;
            });

            this.score = question.score;
        };

    return {
        score: score,

        backToObjectives: backToObjectives,
        showExplanations: showExplanations,
        isShowNextQuestionButton: isShowNextQuestionButton,
        isShowTryAgainButton: isShowTryAgainButton,
        chooseNextQuestion: chooseNextQuestion,
        tryAgain: tryAgain,
        activate: activate
    };
});