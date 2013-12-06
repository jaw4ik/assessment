define(['plugins/http', 'context', 'plugins/router', 'eventManager', 'durandal/app'],
    function (http, context, router, eventManager, app) {

        var learningContents = [],
            enteredOnPage,
            objective,
            question,
            backToQuestions = function () {
                router.navigate('home');
            },
            activate = function (objectiveId, questionId) {
                var that = this;

                this.enteredOnPage = new Date();

                this.objective = _.find(context.objectives, function (item) {
                    return item.id == objectiveId;
                });

                if (_.isUndefined(this.objective)) {
                    router.navigate('404');
                    return undefined;
                }
                this.question = _.find(this.objective.questions, function (item) {
                    return item.id == questionId;
                });

                if (_.isUndefined(this.question)) {
                    router.navigate('404');
                    return undefined;
                }


                this.learningContents = [];
                var requests = [];

                _.each(this.question.learningContents, function (item, index) {
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
            },

            deactivate = function () {
                app.trigger(eventManager.events.learningContentExperienced, {
                    objective: this.objective,
                    question: this.question,
                    spentTime: new Date() - this.enteredOnPage
                });
            };

        return {
            activate: activate,
            deactivate: deactivate,
            learningContents: learningContents,
            backToQuestions: backToQuestions,
        };
    }
);