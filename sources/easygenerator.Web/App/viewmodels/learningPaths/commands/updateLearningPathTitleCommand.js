define(['http/httpWrapper', 'dataContext', 'guard'],
    function (httpWrapper, dataContext, guard) {
        "use strict";

        return {
            execute: function (id, title) {
                return httpWrapper.post('/api/learningpath/title/update', { learningPathId: id, title: title })
                .then(function () {
                    var path = _.find(dataContext.learningPaths, function (item) {
                        return item.id == id;
                    });

                    path.title = title;
                });
            }
        }

    })