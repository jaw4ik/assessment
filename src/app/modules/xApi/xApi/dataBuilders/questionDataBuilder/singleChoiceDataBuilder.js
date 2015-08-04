(function () {
    'use strict';

    angular.module('assessment.xApi').factory('singleChoiceDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
            var selectedAnswer = answers || '';

            var correctAnswersText = _.chain(question.options)
                .filter(function (item) {
                    return item.isCorrect;
                }).map(function (item) {
                    return item.text;
                }).value().join('[,]');

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: question.score / 100
                }),
                response: selectedAnswer.toString()
            });

            var activity = new TinCan.Activity({
                id: questionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    },
                    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    interactionType: interactionTypes.choice,
                    correctResponsesPattern: [correctAnswersText],
                    choices: _.map(question.options, function (option) {
                        return {
                            id: option.id,
                            description: {
                                'en-US': option.text
                            }
                        };
                    })
                })
            });

            return {
                object: activity,
                result: result
            };
        };
    }
}());