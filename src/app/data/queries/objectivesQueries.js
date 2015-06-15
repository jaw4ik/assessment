(function () {
    'use strict';

    angular.module('quiz').factory('objectivesQueries', factory);

    factory.$inject = ['dataContext'];

    function factory(dataContext) {
        return {
            getObjectiveById: getObjectiveById
        };

        function getObjectiveById(objectiveId) {
            var quiz = dataContext.getQuiz(),
                currentObjective = null;

            currentObjective = _.find(quiz.objectives, function (objective) {
                return objective.id === objectiveId;
            });

            return currentObjective;
        }
    }
}());
