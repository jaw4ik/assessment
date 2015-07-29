(function () {
    'use strict';

    angular.module('assessment.xApi').factory('dragAndDropTextDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
            var correctAnswersTexts = _.map(question.dropspots, function (item) {
                return '(' + item.x + ',' + item.y + ')';
            }).join('[,]');

            var enteredAnswersTexts = _.chain(answers)
                .filter(function (spot) {
                    return spot.text;
                })
                .map(function (spot) {
                    return '(' + spot.x + ',' + spot.y + ')';
                })
                .value().join('[,]');

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: question.score / 100
                }),
                response: enteredAnswersTexts
            });

            var activity = new TinCan.Activity({
                id: questionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    },
                    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    interactionType: interactionTypes.other,
                    correctResponsesPattern: [correctAnswersTexts]
                })
            });

            return {
                object: activity,
                result: result
            };
        };
    }
}());