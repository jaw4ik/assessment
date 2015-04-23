(function () {
    'use strict';

    angular.module('quiz').factory('objectivesQueries', factory);

    factory.$inject = ['dataContext'];

    function factory(dataContext) {
        return {
            getObjectiveByQuestionId: getObjectiveByQuestionId
        };

        function getObjectiveByQuestionId(questionId) {
            var quiz = dataContext.getQuiz().$$state.value,
                currentObjective = null;

            currentObjective = _.find(quiz.objectives, function (objective) {
                return _.some(objective.questions, function (question) {
                    return question.id === questionId;
                });
            });

            return currentObjective;
        }
    }
}());
