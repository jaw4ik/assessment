(function () {
    'use strict';

    angular.module('assessment.xApi').factory('statementDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
            var correctAnswersIds = _.map(question.options, function (item) {
                return item.text + '[.]' + item.isCorrect;
            }).join('[,]');

            var selectedAnswersIds = _.chain(answers)
                .filter(function (statement) {
                    return !_.isNull(statement.state) && !_.isUndefined(statement.state);
                }).map(function (statement) {
                    return statement.text + '[.]' + statement.state;
                }).value().toString();

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: question.score / 100
                }),
                response: selectedAnswersIds
            });

            var activity = new TinCan.Activity({
                id: questionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    },
                    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    interactionType: interactionTypes.choice,
                    correctResponsesPattern: [correctAnswersIds],
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