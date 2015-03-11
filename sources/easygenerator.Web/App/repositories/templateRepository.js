define(['dataContext'], function (dataContext) {

    var getCollection = function () {
        var deferred = Q.defer();

        deferred.resolve(dataContext.templates);

        return deferred.promise;
    },

    getById = function (id) {
        var deferred = Q.defer();

        if (_.isNullOrUndefined(id)) {
            throw 'Invalid argument';
        }

        var result = _.find(dataContext.templates, function (item) {
            return item.id === id;
        });

        if (_.isUndefined(result)) {
            deferred.reject('Template does not exist');
        } else {
            deferred.resolve(result);
        }

        return deferred.promise;
    },

    add = function (template) {
        if (!_.isObject(template)) {
            throw 'Template is not an object.';
        }

        dataContext.templates.push(template);
    };

    return {
        getCollection: getCollection,
        getById: getById,
        add: add
    };
});
