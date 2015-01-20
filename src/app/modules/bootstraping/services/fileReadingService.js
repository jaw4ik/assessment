(function () {
    'use strict';
    angular.module('bootstraping')
           .service('fileReadingService', FileReadingService);

    FileReadingService.$inject = ['$q', '$http'];

    function FileReadingService($q, $http) {
        var that = this,
            ticks = new Date().getTime();

        that.readJson = function (url) {
            var defer = $q.defer();
            $http.get(url + '?v=' + ticks).success(function (json) {
                var result = _.isObject(json) ? json : null;
                defer.resolve(result);
            }).error(function () {
                defer.resolve(null);
            });

            return defer.promise;
        }
    }
}());