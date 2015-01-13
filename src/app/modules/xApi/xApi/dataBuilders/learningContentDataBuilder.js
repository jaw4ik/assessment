(function () {
    'use strict';

    angular.module('quiz.xApi').factory('learningContentDataBuilder', factory);

    factory.$inject = ['xApiVerbs'];

    function factory(verbs) {// jshint ignore:line

        return {
            learningContentExperienced: learningContentExperienced
        };

        function learningContentExperienced(objective, question, spentTime) {// jshint ignore:line
            /*var objectiveUrl = getObjectiveUrl(objective.id, question.id);
            var questionUrl = getQuestionUrl(objective.id, question.id);
            var learningContentUrl = rootUrl + '#objective/' + objective.id + '/question/' + question.id + '/learningContents';
            var result = entityFactory.Result({
                duration: TinCan.Utils.getISODateString(spentTime)
            });
            var activity = entityFactory.Activity({
                id: learningContentUrl,
                definition: entityFactory.ActivityDefinition({
                    name: entityFactory.LanguageMap(question.title)
                })
            });
            var context = entityFactory.Context({
                extensions: {
                    'http://easygenerator/expapi/course/id': courseId
                },
                contextActivities: entityFactory.ContextActivities({
                    parent: [entityFactory.Activity({
                        id: questionUrl,
                        definition: entityFactory.ActivityDefinition({
                            name: entityFactory.LanguageMap(question.title)
                        })
                    })],
                    grouping: [entityFactory.Activity({
                        id: objectiveUrl,
                        definition: entityFactory.ActivityDefinition({
                            name: entityFactory.LanguageMap(objective.title)
                        })
                    })]
                })
            });

            return entityFactory.Statement({
                actor: agent,
                verb: verbs.answered,
                object: activity,
                result: result,
                context: context
            });*/
        }
    }
}());