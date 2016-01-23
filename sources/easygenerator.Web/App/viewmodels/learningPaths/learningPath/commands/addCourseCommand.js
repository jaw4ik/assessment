define(['http/apiHttpWrapper', 'dataContext'],
    function (apiHttpWrapper, dataContext) {
        "use strict";

        return {
            execute: function (learningPathId, courseId) {
                return apiHttpWrapper.post('/api/learningpath/course/add', { learningPathId: learningPathId, courseId: courseId })
                .then(function () {
                    var learningPath = _.find(dataContext.learningPaths, function (item) {
                        return item.id === learningPathId;
                    });

                    var course = _.find(dataContext.courses, function (item) {
                        return item.id === courseId;
                    });

                    learningPath.entities.push(course);
                });
            }
        }

    })