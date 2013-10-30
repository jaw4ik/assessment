﻿define(['durandal/app', 'plugins/router', 'context', 'events'], function (app, router, context, events) {
    var objectives = [],
        scores = [],
        overallScore = 0,

        tryAgain = function () {
            context.isTryAgain = true;
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
            var that = this;
            that.status(this.statuses.sendingRequests);
            return app.trigger(events.events.courseFinished, {
                result: Math.round(that.overallScore) / 100,
                callback: function () {
                    events.turnAllEventsOff();
                    that.status(that.statuses.finished);
                    window.close();
                    if (navigator.appName != "Microsoft Internet Explorer") {
                        setTimeout("alert('Thank you. It is now safe to close this page.')", 100);
                    }
                }
            });
        },

        activate = function () {
            var that = this;

            if (context.testResult().length == 0)
                return router.navigate('');
            else {
                if (context.isRestartExperience) {
                    this.status(this.statuses.readyToFinish);
                    context.isRestartExperience = false;
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
            }
        };

    return {
        activate: activate,
        objectives: objectives,
        overallScore: overallScore,
        titleOfExperience: context.title,
        tryAgain: tryAgain,
        finish: finish,
        status: status,
        statuses: statuses
    };
});