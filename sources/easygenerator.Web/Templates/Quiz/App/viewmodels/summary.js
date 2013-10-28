define(['durandal/app', 'plugins/router', 'context', 'events'], function (app, router, context, events) {
    var
        objectives = [],
        scores = [],
        overallScore = 0,

        tryAgain = function () {
            context.isTryAgain = true;
            router.navigate('');
        },

        finish = function () {
            var that = this;
            return app.trigger(events.courseFinished, {
                result: Math.round(that.overallScore),
                callback: function () {
                    _.each(events, function (event) {
                        app.off(event);
                    });

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
        finish: finish
    };
});