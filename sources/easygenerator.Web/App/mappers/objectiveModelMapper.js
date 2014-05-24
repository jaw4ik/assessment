define(['models/objective', 'models/question', 'constants'],
    function (ObjectiveModel, QuestionModel, constants) {
        "use strict";

        var
            map = function (item) {
                return new ObjectiveModel({
                    id: item.Id,
                    title: item.Title,
                    createdBy: item.CreatedBy,
                    createdOn: new Date(item.CreatedOn),
                    modifiedOn: new Date(item.ModifiedOn),
                    image: constants.defaultObjectiveImage,
                    questions: _.map(item.Questions, function (question) {
                        return new QuestionModel({
                            id: question.Id,
                            title: question.Title,
                            content: question.Content,
                            createdOn: new Date(question.CreatedOn),
                            modifiedOn: new Date(question.ModifiedOn),
                            type: question.Type
                        });
                    })
                });
            };

        return {
            map: map
        };
    });