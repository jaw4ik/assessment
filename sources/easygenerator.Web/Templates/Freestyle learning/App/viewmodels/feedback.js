define(['context', 'plugins/router'], function (context, router) {

    var
        score = null,
        objective = null,
        question = null,
        backToObjectives = function () {
            router.navigate('');
        },
        showLearningContents = function () {
            router.navigate('objective/' + objective.id + '/question/' + question.id + '/learningContents');
        },
        isShowNextQuestionButton = function () {
            return this.score == 100;
        },
        isShowTryAgainButton = function () {
            return this.score < 100;
        },
        chooseNextQuestion = function () {
            router.navigate('');
        },
        tryAgain = function () {
            router.navigate('objective/' + objective.id + '/question/' + question.id );
        },
        activate = function (objectiveId, questionId) {
            objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (!objective) {
                router.navigate('404');
                return;
            }

            question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            if (!question) {
                router.navigate('404');
                return;
            }

            this.score = question.score;
        };

    return {
        score: score,

        backToObjectives: backToObjectives,
        showLearningContents: showLearningContents,
        isShowNextQuestionButton: isShowNextQuestionButton,
        isShowTryAgainButton: isShowTryAgainButton,
        chooseNextQuestion: chooseNextQuestion,
        tryAgain: tryAgain,
        activate: activate
    };
});