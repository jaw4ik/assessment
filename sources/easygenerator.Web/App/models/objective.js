﻿define(['models/entity'],
    function (EntityModel) {

        var Objective = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.image = spec.image;
            obj.questions = spec.questions;

            return obj;
        };

        return Objective;
    }
);