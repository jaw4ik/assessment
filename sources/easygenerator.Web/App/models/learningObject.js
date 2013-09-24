define(['models/entity'],
    function (entityModel) {

        var learningObject = function (spec) {

            var obj = new entityModel(spec);

            obj.text = spec.text;
            obj.id = spec.id;

            return obj;
        };

        return learningObject;
    }
);