(function () {
    'use strict';

    angular.module('assessment.xApi').factory('fillInTheBlanksDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
            var correctAnswersTexts = _.flatten(_.map(question.groups, function (item) {
                var correctAnswers = _.where(item.answers, {
                    isCorrect: true
                });
                return _.map(correctAnswers, function (answer) {
                    return answer.text;
                });
            })).join('[,]');

            var enteredAnswersTexts = _.map(answers, function (item) {
                return item;
            }).toString();

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
                    interactionType: interactionTypes.fillIn,
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