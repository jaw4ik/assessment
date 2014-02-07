define([],
    function () {

        function Objective(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.image = spec.image;
            this.questions = spec.questions;
        }

        return Objective;
    }
);