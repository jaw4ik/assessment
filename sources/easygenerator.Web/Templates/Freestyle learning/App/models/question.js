define([],
    function () {

        function Question(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.hasContent = spec.hasContent;
            this.score = spec.score;
            this.answers = spec.answers;
            this.learningContents = spec.learningContents;
        }

        return Question;
    }
);