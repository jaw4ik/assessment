define(['models/question'],
    function (QuestionModel) {
        "use strict";

        var
            map = function (question) {
                return new QuestionModel({
                    id: question.Id,
                    title: question.Title,
                    voiceOver: question.VoiceOver,
                    content: question.Content,
                    createdOn: new Date(question.CreatedOn),
                    modifiedOn: new Date(question.ModifiedOn),
                    type: question.Type
                });
            };

        return {
            map: map
        };
    });