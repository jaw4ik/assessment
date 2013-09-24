define(['durandal/http', 'context', 'durandal/plugins/router'], function (http, context, router) {

    var
        objectiveId = '',
        questionId = '',
        learningObjects = [],

        backToObjectives = function () {
            router.navigateTo('#/');
        },

        backToQuestion = function () {
            router.navigateTo('#/objective/' + objectiveId + '/question/' + questionId);
        },

        activate = function (routeData) {
            objectiveId = routeData.objectiveId;
            questionId = routeData.questionId;

            this.learningObjects = [];

            var objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            var that = this;

            var requests = [];
            _.each(question.learningObjects, function (item, index) {
                requests.push(http.get('content/' + objectiveId + '/' + questionId + '/' + item.id + '.html').done(function (response) {
                    that.learningObjects.push({ index: index, learningObject: response });
                }));
            });

            return $.when.apply($, requests).done(function () {
                that.learningObjects = _.sortBy(that.learningObjects, function (item) {
                    return item.index;
                });
            });
        }
    ;



    return {
        activate: activate,
        learningObjects: learningObjects,
        backToObjectives: backToObjectives,
        backToQuestion: backToQuestion
    };
});