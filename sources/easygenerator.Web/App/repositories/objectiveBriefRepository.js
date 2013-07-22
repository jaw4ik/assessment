define(['dataContext'],
    function (dataContext) {

        var self = {};

        self.dataSet = [];

        self.activate = function () {
            var deferred = Q.defer();
            setTimeout(function () {
                deferred.resolve('data');
            }, 100);

            return deferred.promise;
        };

        return {
            activate: self.activate
        };
    }
);