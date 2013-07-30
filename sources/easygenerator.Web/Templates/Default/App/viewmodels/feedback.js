define(['context', 'durandal/plugins/router'], function (context, router) {

    var
        score = null,
        backToObjectives = function () {
            router.navigateTo('#/');
        },
        showExplanations = function () {
            router.navigateTo('#/');
        },
        chooseNextQuestion = function () {
            router.navigateTo('#/');
        },
        activate = function (routeData) {
            var objective = _.find(context.objectives, function (item) {
                return item.id == routeData.objectiveId;
            });

            var question = _.find(objective.questions, function (item) {
                return item.id == routeData.questionId;
            });

            this.score = question.score;
        };

    return {
        score: score,

        backToObjectives: backToObjectives,
        showExplanations: showExplanations,
        chooseNextQuestion: chooseNextQuestion,
        activate: activate
    };
});