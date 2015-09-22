define(['dataContext', 'guard'],
    function (dataContext, guard) {
        "use strict";

        var repository = {
            getById: getById
        };

        return repository;

        function getById(id) {
            return Q.fcall(function () {
                guard.throwIfNotString(id, 'Learning path id (string) was expected');
                
                var result = _.find(dataContext.learningPaths, function (item) {
                    return item.id === id;
                });

                if (_.isUndefined(result)) {
                    throw 'Learning path with this id is not found';
                };

                return result;
            });
        }
    }
);