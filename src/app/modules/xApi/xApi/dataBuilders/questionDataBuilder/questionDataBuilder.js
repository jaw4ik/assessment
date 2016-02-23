(function () {
    'use strict';

    angular.module('assessment.xApi').factory('questionDataBuilder', factory);

    factory.$inject = ['xApiVerbs', 'xApiSupportedQuestionTypes', 'objectivesQueries',
                      'dragAndDropTextDataBuilder', 'fillInTheBlanksDataBuilder', 'hotspotDataBuilder', 'multipleChoiceDataBuilder',
                      'singleChoiceDataBuilder', 'singleChoiceImageDataBuilder', 'statementDataBuilder', 'textMatchingDataBuilder',
                      'openQuestionDataBuilder', 'scenarioQuestionDataBuilder', 'rankingTextDataBuilder'];

    function factory(verbs, supportedQuestionTypes, objectivesQueries,
        dragAndDropTextDataBuilder, fillInTheBlanksDataBuilder, hotspotDataBuilder, multipleChoiceDataBuilder,
        singleChoiceDataBuilder, singleChoiceImageDataBuilder, statementDataBuilder, textMatchingDataBuilder,
        openQuestionDataBuilder, scenarioQuestionDataBuilder, rankingTextDataBuilder) {
        return {
            questionAnswered: questionAnswered
        };

        function questionAnswered(item, rootUrl) {
            if (!supportedQuestionTypes.checkIfQuestionSupported(item.question.type)) {
                throw 'Question type is not supported';
            }

            var question = item.question,
                answers = item.answers,
                objective = objectivesQueries.getObjectiveById(question.objectiveId),
                questionUrl = rootUrl + '#objective/' + objective.id + '/question/' + question.id,
                parentUrl = rootUrl + '#objectives?objective_id=' + objective.id,
                data = null,
                types = supportedQuestionTypes.types;
            
            switch (item.question.type) {
                case types.multipleChoice:
                    data = multipleChoiceDataBuilder(question, answers, questionUrl);
                    break;
                case types.singleChoice:
                    data = singleChoiceDataBuilder(question, answers, questionUrl);
                    break;
                case types.singleChoiceImage:
                    data = singleChoiceImageDataBuilder(question, answers, questionUrl);
                    break;
                case types.statement:
                    data = statementDataBuilder(question, answers, questionUrl);
                    break;
                case types.dragAndDropText:
                    data = dragAndDropTextDataBuilder(question, answers, questionUrl);
                    break;
                case types.fillInTheBlanks:
                    data = fillInTheBlanksDataBuilder(question, answers, questionUrl);
                    break;
                case types.hotspot:
                    data = hotspotDataBuilder(question, answers, questionUrl);
                    break;
                case types.textMatching:
                    data = textMatchingDataBuilder(question, answers, questionUrl);
                    break;
                case types.openQuestion:
                    data = openQuestionDataBuilder(question, answers, questionUrl);
                    break;
                case types.scenario:
                    data = scenarioQuestionDataBuilder(question, questionUrl);
                    break;
                case types.rankingText:
                    data = rankingTextDataBuilder(question, answers, questionUrl);
                    break;
            }
            
            data.context = defaultContext(parentUrl, objective.title);
            data.verb = verbs.answered;

            return data;
        }

        function defaultContext(parentUrl, objectiveTitle) {
            var parentActivity = new TinCan.Activity({
                id: parentUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': objectiveTitle
                    }
                })
            });
            var context = new TinCan.Context({
                contextActivities: new TinCan.ContextActivities({
                    parent: [parentActivity]
                })
            });
            return context;
        }
    }
}());