define(['durandal/app', 'plugins/router', 'context', 'eventManager', 'windowOperations'],
    function (app, router, context, eventManager, windowOperations) {
        var objectives = [],
            scores = [],
            overallScore = 0,

            tryAgain = function () {
                context.isTryAgain = true;
                context.testResult([]);
                this.status(this.statuses.readyToFinish);
                router.navigate('');
            },

            statuses = {
                readyToFinish: 'readyToFinish',
                sendingRequests: 'sendingRequests',
                finished: 'finished'
            },

            status = ko.observable(statuses.readyToFinish),

            finish = function () {

                status(statuses.sendingRequests);

                if (_.isNullOrUndefined(app.callbacks) || _.isNullOrUndefined(app.callbacks[eventManager.events.courseFinished])) {
                    closeCourse();
                    return;
                }

                var that = this;
                return app.trigger(eventManager.events.courseFinished, {
                    result: Math.round(that.overallScore) / 100,
                    objectives: _.map(that.objectives, function (objective) {
                        return {
                            id: objective.id,
                            title: objective.title,
                            score: objective.score
                        };
                    }),
                    callback: closeCourse
                });
            },

            closeCourse = function () {
                eventManager.turnAllEventsOff();
                status(statuses.finished);
                windowOperations.close();
            },

            activate = function () {
                var that = this;

                if (context.isRestartCourse) {
                    this.status(this.statuses.readyToFinish);
                    context.isRestartCourse = false;
                }
                this.objectives = [];
                scores = [];
                this.overallScore = 0;

                this.objectives = _.map(context.objectives, function (objective) {
                    return {
                        id: objective.id,
                        title: objective.title,
                        image: objective.image,
                        score: 0,
                        count: 0
                    };
                });
                var result = 0;

                _.each(context.testResult(), function (item) {
                    _.each(item.answers, function (answer) {
                        if ((answer.isChecked() && answer.isCorrect) || (!answer.isChecked() && !answer.isCorrect)) {
                            result++;
                        }
                    });

                    scores.push({
                        objectiveId: item.objectiveId,
                        value: (result / item.answers.length) * 100
                    });
                    result = 0;
                });

                _.each(this.objectives, function (objective) {
                    var questionForThisObjective = _.filter(scores, function (item) {
                        return item.objectiveId == objective.id;
                    });

                    var scoreForThisObjective = 0;

                    _.each(questionForThisObjective, function (question) {
                        scoreForThisObjective += question.value;
                    });

                    objective.score = scoreForThisObjective / questionForThisObjective.length;
                    that.overallScore += objective.score;
                });

                this.overallScore = this.overallScore / this.objectives.length;
                return this.overallScore;
            },

            canActivate = function () {
                return !_.isNullOrUndefined(context.testResult) && !_.isNullOrUndefined(context.testResult()) && context.testResult().length > 0;
            };

        return {
            activate: activate,
            canActivate: canActivate,

            objectives: objectives,
            overallScore: overallScore,
            courseTitle: context.title,
            tryAgain: tryAgain,
            finish: finish,
            status: status,
            statuses: statuses
        };
    }
);