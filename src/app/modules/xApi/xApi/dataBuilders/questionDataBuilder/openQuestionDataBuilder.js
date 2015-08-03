(function () {
    'use strict';

    angular.module('assessment.xApi').factory('openQuestionDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
            
            var enteredAnswerText = answers;

            var result = new TinCan.Result({
                response: enteredAnswerText
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