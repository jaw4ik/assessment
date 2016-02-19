(function () {
    'use strict';

    angular.module('assessment.xApi').factory('rankingTextDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
            var answersSequencing = _.map(answers, function (item) {
                return item.text.toLowerCase();
            }).join("[,]");

            var correctAnswersSequencing = _.map(question.correctOrderAnswers, function (item) {
                return item.text.toLowerCase();
            }).join("[,]");

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: question.score / 100
                }),
                response: answersSequencing
            });

            var activity = new TinCan.Activity({
                id: questionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    },
                    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    interactionType: interactionTypes.sequencing,
                    correctResponsesPattern: [correctAnswersSequencing],
                    choices: _.map(question.correctOrderAnswers, function (answer) {
                        return {
                            id: answer.text,
                            description: {
                                'en-US': answer.text
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