define(['dataContext','guard'], function (dataContext, guard) {

    return {
        execute: execute
    };

    function execute(id) {
        return Q.fcall(function() {
            guard.throwIfNotString(id, 'Course id (string) was expected');
            var result = _.find(dataContext.courses, function(item) {
                return item.id === id;
            });

            guard.throwIfNotAnObject(result, 'Course with this id is not found');

            return result;
        });
    }

});