define(['models/learningPath'],
    function (LearningPath) {
        "use strict";

        var
            map = function (learningPath, courses, documents) {

                return new LearningPath({
                    id: learningPath.Id,
                    title: learningPath.Title,
                    publicationUrl: learningPath.PublicationUrl,
                    createdBy: learningPath.CreatedBy,
                    createdOn: new Date(learningPath.CreatedOn),
                    modifiedOn: new Date(learningPath.ModifiedOn),
                    entities: _.map(learningPath.Entities, function (item) {
                        return _.find(courses.concat(documents), function (entity) {
                            return entity.id === item.Id;
                        });
                    }),
                    learningPathCompanies: _.map(learningPath.LearningPathCompanies, function (learningPathCompany) {
                        return {
                            id: learningPathCompany.Id
                        }
                    })
                });
            };

        return {
            map: map
        };
    });