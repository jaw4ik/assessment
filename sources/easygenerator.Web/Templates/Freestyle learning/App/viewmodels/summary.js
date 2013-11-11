define(['durandal/app', 'context', 'plugins/router', 'eventManager'],
    function (app, context, router, eventManager) {
        var
            objectives = [],
            score = 0,

            statuses = {
                readyToFinish: 'readyToFinish',
                sendingRequests: 'sendingRequests',
                finished: 'finished'
            },
            status = ko.observable(statuses.readyToFinish),

            activate = function () {

                function getObjectiveScore(objective) {
                    var result = _.reduce(objective.questions, function (memo, question) { return memo + question.score; }, 0);
                    return result / objective.questions.length;
                }

                this.objectives = _.map(context.objectives, function (item) {
                    return { title: item.title, score: getObjectiveScore(item) };
                });

                var result = _.reduce(this.objectives, function (memo, objective) { return memo + objective.score; }, 0);
                this.score = result / this.objectives.length;
            },

            navigateBack = function () {
                router.navigateBack();
            },

            finish = function () {
                var that = this;
                that.status(this.statuses.sendingRequests);

                return app.trigger(eventManager.events.courseFinished, {
                    result: Math.round(that.score) / 100,
                    objectives: _.map(that.objectives, function (objective) {
                        return {
                            id: objective.id,
                            title: objective.title,
                            score: objective.score
                        };
                    }),
                    callback: function () {
                        eventManager.turnAllEventsOff();
                        that.status(that.statuses.finished);
                        window.close();
                        if (navigator.appName != "Microsoft Internet Explorer") {
                            setTimeout("alert('Thank you. It is now safe to close this page.')", 100);
                        }
                    }
                });
            };

        return {
            activate: activate,
            navigateBack: navigateBack,
            finish: finish,

            score: score,
            objectives: objectives,
            status: status,
            statuses: statuses
        };
    });