define(['dataContext'], function (dataContext) {

    var self = {};

    self.getCollection = function () {
        var deferred = Q.defer();

        deferred.resolve(dataContext.objectives);

        return deferred.promise;
    };

    self.getById = function (id) {
        var deferred = Q.defer();

        deferred.resolve(_.find(dataContext.objectives, function (item) {
            return item.id == id;
        }));

        return deferred.promise;
    };

    //todo: refactor
    self.update = function(obj) {
        var deferred = Q.defer();

        deferred.resolve(true);

        return deferred.promise;
    };

    return {
        getById: self.getById,
        getCollection: self.getCollection,
        update: self.update
    };
}
);