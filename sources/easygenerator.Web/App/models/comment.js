define(['models/entity'],
    function (EntityModel) {

        var Comment = function (spec) {

            var obj = new EntityModel(spec);

            obj.text = spec.text;

            return obj;
        };

        return Comment;
    }
);