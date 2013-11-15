define([],
    function () {

        var QuestionResult = function (spec) {
            return {
                id: spec.id,
                title: spec.title,
                answers: spec.answers,
                score: spec.score,
                getScore: getScore,
                getSelectedAnswersId: getSelectedAnswersId,
                getCorrectAnswersIds: getCorrectAnswersIds,
                objectiveId: spec.objectiveId,
                objectiveTitle: spec.objectiveTitle
            };
        };

        var getScore = function () {
            if (this.answers.length > 0) {
                var score = 0;
                _.each(this.answers, function (answer) {
                    if ((answer.isChecked() && answer.isCorrect) || (!answer.isChecked() && !answer.isCorrect)) {
                        score++;
                    }
                });
                score = (score / this.answers.length) * 100;
            }
            return score;
        };

        var getCorrectAnswersIds = function () {
            return _.chain(this.answers)
                .filter(function (item) {
                    return item.isCorrect;
                })
                .map(function (item) {
                    return item.id;
                }).value();
        };

        var getSelectedAnswersId = function () {
            return _.chain(this.answers)
                .filter(function (item) {
                    return item.isChecked();
                })
                .map(function (item) {
                    return item.id;
                }).value();
        };

        return QuestionResult;
    }
);