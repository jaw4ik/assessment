define(['durandal/http', 'context', 'durandal/plugins/router'], function (http, context, router) {

    var objectiveId = '',
        questionId = '',
        learningContents = [],
        backToQuestions = function () {
            router.navigateTo('#/');
        },
        activate = function (routeData) {
            if (_.isUndefined(routeData.objectiveId) || _.isUndefined(routeData.questionId)
                || _.isNull(routeData.objectiveId) || _.isNull(routeData.questionId)) {
                router.navigateTo('#/400');
                return undefined;
            }

            var that = this;

            objectiveId = routeData.objectiveId;
            questionId = routeData.questionId;

            var objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (_.isUndefined(objective)) {
                router.navigateTo('#/404');
                return undefined;
            }

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            if (_.isUndefined(question)) {
                router.navigateTo('#/404');
                return undefined;
            }


            this.learningContents = [];
            var requests = [];

            _.each(question.learningContents, function (item, index) {
                requests.push(http.get('content/' + objectiveId + '/' + questionId + '/' + item.id + '.html').done(function (response) {
                    that.learningContents.push({ index: index, learningContent: response });
                }));
            });

            window.scroll(0, 0);

            return $.when.apply($, requests).done(function () {
                that.learningContents = _.sortBy(that.learningContents, function (item) {
                    return item.index;
                });
            });
        };

    return {
        activate: activate,
        learningContents: learningContents,
        backToQuestions: backToQuestions,
    };
});