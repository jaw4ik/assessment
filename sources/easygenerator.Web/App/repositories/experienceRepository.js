define(['dataContext'], function (dataContext) {

    var self = {};

    self.getCollection = function () {
        var deferred = Q.defer();

        deferred.resolve(dataContext.experiences);

        return deferred.promise;
    };

    self.getById = function(id) {
        var deferred = Q.defer();

        deferred.resolve(_.find(dataContext.experiences, function(item) {
            return item.id == id;
        }));

        return deferred.promise;
    };

    return {
        getById: self.getById,
        getCollection: self.getCollection
    };
}
);