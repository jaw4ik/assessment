(function () {
    'use strict';

    angular.module('quiz.xApi').factory('learningContentDataBuilder', factory);

    factory.$inject = ['xApiVerbs', 'objectivesQueries', 'dateTimeConverter'];

    function factory(verbs, objectivesQueries, dateTimeConverter) {

        return {
            learningContentExperienced: learningContentExperienced
        };

        function learningContentExperienced(question, spentTime, rootUrl) {
            var objective = objectivesQueries.getObjectiveById(question.objectiveId),
                questionUrl = rootUrl + '#objective/' + objective.id + '/question/' + question.id,
                parentUrl = rootUrl + '#objectives?objective_id=' + objective.id,
                learningContentUrl = rootUrl + '#objective/' + objective.id + '/question/' + question.id + '/learningContents';

            var result = new TinCan.Result({
                duration: dateTimeConverter.timeToISODurationString(spentTime)
            });

            var activity = new TinCan.Activity({
                id: learningContentUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    }
                })
            });

            var context = new TinCan.Context({
                contextActivities: new TinCan.ContextActivities({
                    parent: [new TinCan.Activity({
                        id: questionUrl,
                        definition: new TinCan.ActivityDefinition({
                            name: {
                                'en-US': question.title
                            }
                        })
                    })],
                    grouping: [new TinCan.Activity({
                        id: parentUrl,
                        definition: new TinCan.ActivityDefinition({
                            name: {
                                'en-US': objective.title
                            }
                        })
                    })]
                })
            });

            return {
                object: activity,
                result: result,
                context: context,
                verb: verbs.experienced
            };
        }
    }
}());