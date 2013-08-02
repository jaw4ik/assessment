define(['durandal/http', 'context', 'durandal/plugins/router'], function (http, context, router) {

    var
        objectiveId = '',
        questionId = '',
        explanations = [],

        backToObjectives = function () {
            router.navigateTo('#/');
        },

        backToQuestion = function () {
            router.navigateTo('#/objective/' + objectiveId + '/question/' + questionId);
        },

        activate = function (routeData) {
            objectiveId = routeData.objectiveId;
            questionId = routeData.questionId;

            this.explanations = [];

            var objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            var that = this;

            var requests = [];
            _.each(question.explanations, function (item, index) {
                requests.push(http.get('content/' + objectiveId + '/' + questionId + '/' + item.id + '.html').done(function (response) {
                    that.explanations.push({ index: index, explanation: response });
                }));
            });

            return $.when.apply($, requests).done(function () {
                that.explanations = _.sortBy(that.explanations, function (item) {
                    return item.index;
                });
            });
        }
    ;



    return {
        activate: activate,
        explanations: explanations,
        backToObjectives: backToObjectives,
        backToQuestion: backToQuestion
    };
});