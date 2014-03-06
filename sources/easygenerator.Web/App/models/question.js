﻿define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var Question = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.content = spec.content;

            return obj;
        };

        return Question;
    }
);