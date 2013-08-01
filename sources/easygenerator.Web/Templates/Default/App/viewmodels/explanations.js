define(['durandal/http', 'context', 'durandal/plugins/router'], function (http, context, router) {

    var objectiveId = '',
        questionId = '',
        explanations = ko.observableArray([]),

        backToObjectives = function () {
            router.navigateTo('#/');
        },

        backToQuestion = function () {
            router.navigateTo('#/objective/' + objectiveId + '/question/' + questionId);
        },

        activate = function (routeData) {
            explanations([]);
            objectiveId = routeData.objectiveId;
            questionId = routeData.questionId;

            var objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            var requests = _.map(question.explanations, function (explanation, key) {
                return $.get('content/' + objectiveId + '/' + questionId + '/' + explanation.id + '.html')
                    .then(function (explanationData) {
                        explanations.push({
                            index: key,
                            explanation: explanationData
                        });
                    });
            });

            return Q.all(requests).then(function () {
                explanations(_.sortBy(explanations(), function (item) {
                    return item.index;
                }));
            });
        };

    return {
        activate: activate,
        explanations: explanations,
        backToObjectives: backToObjectives,
        backToQuestion: backToQuestion
    };
});