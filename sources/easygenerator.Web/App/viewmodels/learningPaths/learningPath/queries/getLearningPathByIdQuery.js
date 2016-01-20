define(['dataContext'],
    function (dataContext) {
        "use strict";
        return {
            execute: function (learningPathId) {
                return Q.fcall(function () {
                    return _.find(dataContext.learningPaths, function (item) {
                        return item.id === learningPathId;
                    });
                });

            }
        }

    })