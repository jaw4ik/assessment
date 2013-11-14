define(['xApi/guard'],
    function (guard) {
        function Question (spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.answers = spec.answers;
            this.learningContents = spec.learningContents;
            this.score = spec.score;
            this.objectiveId = spec.objectiveId;
            this.objectiveTitle = spec.objectiveTitle;
        };

        Question.prototype.getScore = function() {
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

        Question.prototype.getCorrectAnswersIds = function () {
            return _.chain(this.answers)
                .filter(function (item) {
                    return item.isCorrect;
                })
                .map(function (item) {
                    return item.id;
                }).value();
        };

        Question.prototype.getSelectedAnswersId = function () {
            return _.chain(this.answers)
                .filter(function(item) {
                    return item.isChecked();
                })
                .map(function(item) {
                    return item.id;
                }).value();
        };

        return Question;
    }
);