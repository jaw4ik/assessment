define(['models/entity'],
    function (entityModel) {

        var template = function (spec) {

            var obj = new entityModel(spec);

            obj.name = spec.name;
            obj.image = spec.image;
            obj.description = spec.description;

            return obj;
        };

        return template;
    }
);