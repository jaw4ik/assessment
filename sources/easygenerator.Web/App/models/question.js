define(['models/entity'],
    function (EntityModel) {

        var Question = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.text = spec.text;
            obj.answers = spec.answers;

            return obj;
        };

        return Question;
    }
);