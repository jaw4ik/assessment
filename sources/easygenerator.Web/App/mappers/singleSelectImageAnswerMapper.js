define(['models/singleSelectImageAnswer'],
    function (SingleSelectImageAnswerModel) {
        "use strict";

        var
            map = function (answer) {
                return new SingleSelectImageAnswerModel({
                    id: answer.Id,
                    image: answer.Image,
                    createdOn: new Date(answer.CreatedOn),
                    modifiedOn: new Date(answer.ModifiedOn),
                });
            };

        return {
            map: map
        };
    });