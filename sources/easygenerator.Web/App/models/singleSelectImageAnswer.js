define(['models/entity'],
    function (entityModel) {
        "use strict";

        var learningContent = function (spec) {

            var obj = new entityModel(spec);

            obj.image = spec.image;

            return obj;
        };

        return learningContent;
    }
);