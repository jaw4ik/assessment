define(['durandal/http', 'context', 'durandal/plugins/router'], function (http, context, router) {

    var
        objectiveId = '',
        questionId = '',
        learningContents = [],

        backToObjectives = function () {
            router.navigate('');
        },

        backToQuestion = function () {
            router.navigate('objective/' + this.objectiveId + '/question/' + this.questionId);
        },

        activate = function (routeData) {
            this.objectiveId = objectiveId;
            this.questionId = questionId;

            this.learningContents = [];

            var objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (!objective) {
                router.navigate('404');
                return;
            }

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            if (!question) {
                router.navigate('404');
                return;
            }

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