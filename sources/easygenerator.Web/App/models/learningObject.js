define(['models/entity'],
    function (entityModel) {

        var learningObject = function (spec) {

            var obj = new entityModel(spec);

            obj.text = spec.text;

            return obj;
        };

        return learningObject;
    }
);