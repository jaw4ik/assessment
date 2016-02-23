define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var Comment = function (spec) {

            var obj = new EntityModel(spec);

            obj.text = spec.text;
            obj.name = spec.name;
            obj.email = spec.email;
            obj.context = spec.context;

            return obj;
        };

        return Comment;
    }
);