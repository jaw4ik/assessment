define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var Section = function (spec) {

            EntityModel.call(this, spec);

            this.title = spec.title;
            this.image = spec.image;
            this.learningObjective = spec.learningObjective;
            this.questions = spec.questions;
            this.createdBy = spec.createdBy;
        };

        return Section;
    }
);