define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var Question = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.voiceOver = spec.voiceOver;
            obj.content = spec.content;
            obj.type = spec.type;

            return obj;
        };

        return Question;
    }
);