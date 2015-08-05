define(['models/learningPath'],
    function (LearningPath) {
        "use strict";

        var
            map = function (learningPath, courses) {

                return new LearningPath({
                    id: learningPath.Id,
                    title: learningPath.Title,
                    publicationUrl: learningPath.PublicationUrl,
                    createdBy: learningPath.CreatedBy,
                    createdOn: new Date(learningPath.CreatedOn),
                    modifiedOn: new Date(learningPath.ModifiedOn),
                    courses: _.map(learningPath.Courses, function (item) {
                        return _.find(courses, function (course) {
                            return course.id == item.Id;
                        });
                    }),
                });
            };

        return {
            map: map
        };
    });