﻿define(['http/apiHttpWrapper', 'dataContext'],
    function (apiHttpWrapper, dataContext) {
        "use strict";

        return {
            execute: function (learningPathId, courseId) {
                return apiHttpWrapper.post('/api/learningpath/course/remove', { learningPathId: learningPathId, courseId: courseId })
                .then(function () {
                    var learningPath = _.find(dataContext.learningPaths, function (item) {
                        return item.id === learningPathId;
                    });

                    learningPath.entities = _.reject(learningPath.entities, function (item) {
                        return item.id === courseId;
                    });
                });
            }
        }

    })