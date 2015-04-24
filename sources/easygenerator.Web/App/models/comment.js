define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var Comment = function (spec) {

            var obj = new EntityModel(spec);

            obj.text = spec.text;

            return obj;
        };

        return Comment;
    }
);