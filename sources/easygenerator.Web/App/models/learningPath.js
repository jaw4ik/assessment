define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var LearningPath = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;

            return obj;
        };

        return LearningPath;
    }
);