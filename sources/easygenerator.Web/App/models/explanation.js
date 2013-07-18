define(['models/entity'],
    function (entityModel) {

        var explanation = function (spec) {

            var obj = new entityModel(spec);

            obj.text = spec.text;
            obj.id = spec.id;

            return obj;
        };

        return explanation;
    }
);