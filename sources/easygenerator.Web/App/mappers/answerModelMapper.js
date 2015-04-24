define(['models/answerOption'],
    function (AnswerModel) {
        "use strict";

        var
            map = function (answer) {
                return new AnswerModel({
                    id: answer.Id,
                    text: answer.Text,
                    isCorrect: answer.IsCorrect,
                    createdOn: answer.CreatedOn
                });
            };

        return {
            map: map
        };
    });