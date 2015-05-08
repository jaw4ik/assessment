define(['dataContext', 'guard'], function (dataContext, guard) {

    return {
        execute: execute
    };

    function execute(id) {
        return Q.fcall(function () {
            guard.throwIfNotString(id, 'Objective id (string) was expected');
            var result = _.find(dataContext.objectives, function (item) {
                return item.id === id;
            });

            guard.throwIfNotAnObject(result, 'Objective with this id is not found');

            return result;
        });
    }

});