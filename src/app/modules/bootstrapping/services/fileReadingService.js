(function () {
    'use strict';
    angular.module('bootstrapping')
           .service('fileReadingService', FileReadingService);

    FileReadingService.$inject = ['$q', '$http'];

    function FileReadingService($q, $http) {
        var that = this,
            ticks = new Date().getTime();

        that.readJson = function (url) {
            return read(url + '?v=' + ticks, function (json) {
                return _.isObject(json) ? json : null;
            });
        };

        that.readHtml = function (url) {
            return read(url, function (html) {
                return _.isString(html) ? html : null;
            });
        };

        function read(url, callback) {
            var defer = $q.defer();
            $http.get(url).success(function (response) {
                var result = callback.call(this, response);
                defer.resolve(result);
            }).error(function () {
                defer.resolve(null);
            });

            return defer.promise;
        }
    }
}());