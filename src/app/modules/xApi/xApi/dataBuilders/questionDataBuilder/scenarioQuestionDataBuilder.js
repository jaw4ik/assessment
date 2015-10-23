(function () {
    'use strict';

    angular.module('assessment.xApi').factory('scenarioQuestionDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, questionUrl) {

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: question.score / 100
                })
            });

            var activity = new TinCan.Activity({
                id: questionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    },
                    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    interactionType: interactionTypes.other
                })
            });

            return {
                object: activity,
                result: result
            };
        };
    }
}());