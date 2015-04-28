define(['models/learningContent'],
    function (LearningContentModel) {
        "use strict";

        var
            map = function (learningContent) {
                return new LearningContentModel({
                    id: learningContent.Id,
                    text: learningContent.Text,
                    createdOn: learningContent.CreatedOn
                });
            };

        return {
            map: map
        };
    });