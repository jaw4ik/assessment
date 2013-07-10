define(['models/entity'],
    function (EntityModel) {

        var Question = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.answerOptions = spec.answerOptions;
            obj.explanations = spec.explanations;

            return obj;
        };

        return Question;
    }
);