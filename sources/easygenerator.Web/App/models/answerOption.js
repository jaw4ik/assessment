define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var AnswerOption = function (spec) {

            var obj = new EntityModel(spec);

            obj.text = spec.text;
            obj.isCorrect = spec.isCorrect;
            obj.groupId = spec.groupId;

            return obj;
        };

        return AnswerOption;
    }
);