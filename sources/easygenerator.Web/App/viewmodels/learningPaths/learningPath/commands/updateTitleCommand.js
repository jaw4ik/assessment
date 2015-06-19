define(['http/apiHttpWrapper', 'dataContext'],
    function (apiHttpWrapper, dataContext) {
        "use strict";

        return {
            execute: function (id, title) {
                return apiHttpWrapper.post('/api/learningpath/title/update', { learningPathId: id, title: title })
                .then(function () {
                    var path = _.find(dataContext.learningPaths, function (item) {
                        return item.id == id;
                    });

                    path.title = title;
                });
            }
        }

    })