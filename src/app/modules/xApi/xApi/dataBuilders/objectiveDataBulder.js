(function () {
    'use strict';

    angular.module('assessment.xApi').factory('objectiveDataBuilder', factory);

    factory.$inject = ['xApiVerbs'];

    function factory(verbs) {
        return {
            objectiveMasteredData: objectiveMasteredData
        };

        function objectiveMasteredData(objective, rootUrl) {
            var objectiveUrl = rootUrl + '#objectives?objective_id=' + objective.id;

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: objective.getResult() / 100
                })
            });

            var activity = new TinCan.Activity({
                id: objectiveUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': objective.title
                    }
                })
            });

            return {
                verb: verbs.mastered,
                object: activity,
                result: result,
            };
        }
    }
}());