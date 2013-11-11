define(['durandal/app', 'eventManager', 'plugins/http', 'context', 'plugins/router'], function (app, eventManager, http, context, router) {

    var
        objectiveId = '',
        questionId = '',
        learningContents = [],

        enteredOnPage = null,
        learningContentsUrl = '',
        questionTitle = '',

        backToObjectives = function () {
            router.navigate('');
        },

        backToQuestion = function () {
            router.navigate('objective/' + this.objectiveId + '/question/' + this.questionId);
        },

        activate = function (objectiveId, questionId) {
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

            this.enteredOnPage = new Date();
            this.learningContentsUrl = window.location.toString();
            this.questionTitle = question.title;

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
        },

        deactivate = function () {
            //app.trigger(eventManager.events.learningContentExperienced, {
            //    objectiveId: this.objectiveId,
            //    questionId: this.questionId,
            //    spentTime: new Date() - this.enteredOnPage
            //});
        }
    ;



    return {
        activate: activate,
        deactivate: deactivate,

        learningContents: learningContents,
        backToObjectives: backToObjectives,
        backToQuestion: backToQuestion
    };
});