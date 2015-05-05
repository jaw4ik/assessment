define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var Objective = function (spec) {

            EntityModel.call(this, spec);

            this.title = spec.title;
            this.image = spec.image;
            this.questions = spec.questions;
            this.createdBy = spec.createdBy;
        };

        return Objective;
    }
);