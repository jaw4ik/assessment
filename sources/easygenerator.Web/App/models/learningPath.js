define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var LearningPath = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.courses = spec.courses;

            return obj;
        };

        return LearningPath;
    }
);