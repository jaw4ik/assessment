define([],
    function () {

        function Objective(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.image = spec.image;
            this.questions = spec.questions;
            this.score = spec.score;
            this.calculateScore = calculateScore;
        }

        var calculateScore = function () {
            var result = _.reduce(this.questions, function (memo, question) { return memo + question.score; }, 0);
            this.score = result / this.questions.length;
        };

        return Objective;
    }
);