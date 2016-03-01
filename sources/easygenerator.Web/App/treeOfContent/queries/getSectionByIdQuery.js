define(['dataContext', 'guard'], function (dataContext, guard) {

    return {
        execute: execute
    };

    function execute(id) {
        return Q.fcall(function () {
            guard.throwIfNotString(id, 'Section id (string) was expected');
            var result = _.find(dataContext.sections, function (item) {
                return item.id === id;
            });

            guard.throwIfNotAnObject(result, 'Section with this id is not found');

            return result;
        });
    }

});