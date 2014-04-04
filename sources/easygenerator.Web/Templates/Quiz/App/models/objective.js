define(['modules/courseSettings'],
    function (courseSettings) {

        function Objective(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.image = spec.image;
            this.questions = spec.questions;
            this.score = 0;
            this.isCompleted = false;
            this.calculateScore = calculateScore;
        }

        var calculateScore = function () {
            var result = _.reduce(this.questions, function (memo, question) { return memo + question.score; }, 0);
            var questionsLength = this.questions.length;
            this.score = questionsLength == 0 ? 0 : result / questionsLength;
            this.isCompleted = this.score >= courseSettings.masteryScore.score;
        };

        return Objective;
    }
);