define(['models/learningPath'],
    function (LearningPath) {
        "use strict";

        var
            map = function (learningPath) {
                return new LearningPath({
                    id: learningPath.Id,
                    title: learningPath.Title,
                    createdBy: learningPath.CreatedBy,
                    createdOn: new Date(learningPath.CreatedOn),
                    modifiedOn: new Date(learningPath.ModifiedOn)
                });
            };

        return {
            map: map
        };
    });