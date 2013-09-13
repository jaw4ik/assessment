define(['durandal/plugins/router', 'context'], function (router, context) {
    var
        objectives = [],
        scores = [],
        overallScore = 0,

        tryAgain = function () {
            context.isTryAgain = true;
            router.navigateTo('#/');
        },

        finish = function () {
            alert('You overall score ' + this.overallScore + '%');
        },

        activate = function () {
            var that = this;

            if (context.testResult().length == 0)
                return router.navigateTo('#/');
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
                
                _.each(scores, function (score) {
                    _.each(that.objectives, function (objective) {
                        if (score.objectiveId == objective.id) {
                            objective.score += score.value;
                            objective.count++;
                        }
                    });
                    that.overallScore = that.overallScore + score.value;
                });

                this.overallScore = Math.round(this.overallScore / scores.length);

                window.scroll(0, 0);

                return _.each(this.objectives, function (objective) {
                    objective.score = Math.round(objective.score / objective.count);
                });
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