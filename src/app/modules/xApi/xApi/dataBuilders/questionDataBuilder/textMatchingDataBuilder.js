(function () {
    'use strict';

    angular.module('assessment.xApi').factory('textMatchingDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
            var response = _.map(answers, function (value) {
                return value.key.toLowerCase() + '[.]' + (value.value ? value.value.toLowerCase() : '');
            }).join('[,]');

            var correctResponsesPattern = [_.map(question.answers, function (answer) {
                    return answer.key.toLowerCase() + '[.]' + answer.value.toLowerCase();
                }).join('[,]')];

            var source = _.map(question.answers, function (answer) {
                return {
                    id: answer.key.toLowerCase(),
                    description: {
                        'en-US': answer.key
                    }
                };
            });

            var target = _.map(question.answers, function (answer) {
                return {
                    id: answer.value.toLowerCase(),
                    description: {
                        'en-US': answer.value
                    }
                };
            });

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: question.score / 100
                }),
                response: response
            });

            var activity = new TinCan.Activity({
                id: questionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    },
                    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    interactionType: interactionTypes.matching,
                    correctResponsesPattern: correctResponsesPattern,
                    source: source,
                    target: target
                })
            });

            return {
                object: activity,
                result: result
            };
        };
    }
}());