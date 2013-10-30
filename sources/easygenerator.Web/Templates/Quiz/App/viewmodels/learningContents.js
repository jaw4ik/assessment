define(['plugins/http', 'context', 'plugins/router'], function (http, context, router) {

    var learningContents = [],
        backToQuestions = function () {
            router.navigate('home');
        },
        activate = function (objectiveId, questionId) {
            var that = this;

            var objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (_.isUndefined(objective)) {
                router.navigate('404');
                return undefined;
            }

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            if (_.isUndefined(question)) {
                router.navigate('404');
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