define(['http/apiHttpWrapper', 'dataContext'],
    function (apiHttpWrapper, dataContext) {
        "use strict";

        return {
            execute: function (learningPathId, courses) {
                return apiHttpWrapper.post('/api/learningpath/courses/order/update', {
                    learningPathId: learningPathId,
                    courses: _.map(courses, function (course) {
                        return course.id;
                    })
                })
                .then(function () {
                    var learningPath = _.find(dataContext.learningPaths, function (item) {
                        return item.id == learningPathId;
                    });

                    learningPath.courses = _.map(courses, function (course) {
                        return _.find(learningPath.courses, function (item) {
                            return item.id == course.id;
                        });
                    });
                });
            }
        }

    })