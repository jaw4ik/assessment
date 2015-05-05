define(['models/entity'],
    function (entityModel) {
        "use strict";

        var learningContent = function (spec) {

            var obj = new entityModel(spec);

            obj.text = spec.text;

            return obj;
        };

        return learningContent;
    }
);