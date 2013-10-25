define(['durandal/http', 'context', 'durandal/plugins/router'], function (http, context, router) {

    var
        objectiveId = '',
        questionId = '',
        learningContents = [],

        backToObjectives = function () {
            router.navigateTo('#/');
        },

        backToQuestion = function () {
            router.navigateTo('#/objective/' + objectiveId + '/question/' + questionId);
        },

        activate = function (routeData) {
            objectiveId = routeData.objectiveId;
            questionId = routeData.questionId;

            this.learningContents = [];

            var objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            var that = this;

            var requests = [];
            _.each(question.learningContents, function (item, index) {
                requests.push(http.get('content/' + objectiveId + '/' + questionId + '/' + item.id + '.html').done(function (response) {
                    that.learningContents.push({ index: index, learningContent: response });
                }));
            });

            return $.when.apply($, requests).done(function () {
                that.learningContents = _.sortBy(that.learningContents, function (item) {
                    return item.index;
                });
            });
        }
    ;



    return {
        activate: activate,
        learningContents: learningContents,
        backToObjectives: backToObjectives,
        backToQuestion: backToQuestion
    };
});