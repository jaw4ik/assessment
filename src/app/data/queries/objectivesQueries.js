(function () {
    'use strict';

    angular.module('assessment').factory('objectivesQueries', factory);

    factory.$inject = ['dataContext'];

    function factory(dataContext) {
        return {
            getObjectiveById: getObjectiveById
        };

        function getObjectiveById(objectiveId) {
            var assessment = dataContext.getAssessment(),
                currentObjective = null;

            currentObjective = _.find(assessment.objectives, function (objective) {
                return objective.id === objectiveId;
            });

            return currentObjective;
        }
    }
}());
