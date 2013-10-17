define(['models/entity'],
    function (EntityModel) {

        var Question = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;

            return obj;
        };

        return Question;
    }
);