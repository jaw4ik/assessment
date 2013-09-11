﻿define(['dataContext', 'repositories/objectiveRepository', 'durandal/system'], function (dataContext, objectiveRepository, system) {

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
    };

    return {
        getCollection: getCollection,
        getById: getById
    };
});
