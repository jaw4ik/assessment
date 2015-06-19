define(['dataContext', 'userContext'],
    function (dataContext, userContext) {
        "use strict";
        return {
            execute: function () {
                return Q.fcall(function () {
                    return _.filter(dataContext.courses, function (item) {
                        return item.createdBy === userContext.identity.email;
                    });
                });

            }
        }

    })