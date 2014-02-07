define([],
    function () {

        function Answer(spec) {
            this.id = spec.id;
            this.text = spec.text;
            this.isCorrect = spec.isCorrect;
        }

        return Answer;
    }
);