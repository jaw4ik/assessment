define(['eventManager', 'plugins/http', 'context', 'plugins/router'], function (eventManager, http, context, router) {

    var
        learningContents = [],

        enteredOnPage = null,
        objective = null,
        question = null,

        backToObjectives = function () {
            router.navigate('objectives');
        },

        backToQuestion = function () {
            router.navigate('objective/' + this.objective.id + '/question/' + this.question.id);
        },

        activate = function (objectiveId, questionId) {
            this.learningContents = [];

            this.objective = _.find(context.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (!this.objective) {
                router.navigate('404');
                return;
            }

            this.question = _.find(this.objective.questions, function (item) {
                return item.id == questionId;
            });

            if (!this.question) {
                router.navigate('404');
                return;
            }

            this.enteredOnPage = new Date();

            var that = this;

            var requests = [];
            _.each(this.question.learningContents, function (item, index) {
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
            eventManager.learningContentExperienced({
                objective: this.objective,
                question: this.question,
                spentTime: new Date() - this.enteredOnPage
            });
        }
    ;



    return {
        activate: activate,
        deactivate: deactivate,

        learningContents: learningContents,
        backToObjectives: backToObjectives,
        backToQuestion: backToQuestion,
        enteredOnPage: enteredOnPage
    };
});