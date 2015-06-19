define(['http/apiHttpWrapper', 'dataContext'],
    function (apiHttpWrapper, dataContext) {
        "use strict";

        return {
            execute: function (learningPathId) {
                return apiHttpWrapper.post('/api/learningpath/delete', { learningPathId: learningPathId })
                .then(function () {
                    dataContext.learningPaths = _.reject(dataContext.learningPaths, function (item) {
                        return item.id === learningPathId;
                    });
                });
            }
        }

    })