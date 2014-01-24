define(['durandal/app', 'context', 'plugins/router', 'eventManager', 'windowOperations'],
    function (app, context, router, eventManager, windowOperations) {
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
                    return { id: item.id, title: item.title, score: getObjectiveScore(item) };
                });

                var result = _.reduce(this.objectives, function (memo, objective) { return memo + objective.score; }, 0);
                this.score = result / this.objectives.length;
            },

            navigateBack = function () {
                router.navigateBack();
            },

            finish = function () {
                status(statuses.sendingRequests);

                var that = this;
                eventManager.courseFinished({
                    result: Math.round(that.score) / 100,
                    objectives: _.map(that.objectives, function (objective) {
                        return {
                            id: objective.id,
                            title: objective.title,
                            score: objective.score
                        };
                    })
                }, closeCourse);
            },

            closeCourse = function () {
                eventManager.turnAllEventsOff();
                status(statuses.finished);
                windowOperations.close();
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