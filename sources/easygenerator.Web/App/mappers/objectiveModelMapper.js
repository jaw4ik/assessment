define(['models/objective', 'models/question', 'constants', 'mappers/questionModelMapper'],
    function (ObjectiveModel, QuestionModel, constants, questionModelMapper) {
        "use strict";

        var
            map = function (item) {
                return new ObjectiveModel({
                    id: item.Id,
                    title: item.Title,
                    createdBy: item.CreatedBy,
                    createdOn: new Date(item.CreatedOn),
                    modifiedOn: new Date(item.ModifiedOn),
                    image: item.ImageUrl,
                    questions: _.map(item.Questions, questionModelMapper.map)
                });
            };

        return {
            map: map
        };
    });