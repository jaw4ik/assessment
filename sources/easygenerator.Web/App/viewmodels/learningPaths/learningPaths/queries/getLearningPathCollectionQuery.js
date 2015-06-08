define(['dataContext'],
    function (dataContext) {
        "use strict";
        return {
            execute: function () {
                return Q.fcall(function () {
                    return dataContext.learningPaths;
                });

            }
        }

    })