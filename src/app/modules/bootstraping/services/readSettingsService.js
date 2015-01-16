(function () {
    'use strict';
    angular.module('bootstraping')
           .service('readSettingsService', ReadSettingsService);

    ReadSettingsService.$inject = ['$q', '$http'];

    function ReadSettingsService($q, $http) {
        var that = this,
            ticks = new Date().getTime();

        that.read = function () {
            return readSettings('settings.js?_=' + ticks);
        };

        function readSettings(url) {
            var defer = $q.defer();
            $http.get(url).success(function (json) {
                var result = _.isObject(json) ? json : null;
                defer.resolve(result);
            }).error(function () {
                defer.resolve(null);
            });

            return defer.promise;
        }
    }
}());