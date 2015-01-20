(function () {
    'use strict';
    angular.module('quiz.publishSettingsSetup')
           .service('publishModuleLoader', PublishModuleLoader);

    PublishModuleLoader.$inject = ['$q'];

    function PublishModuleLoader($q) {
        var that = this;

        that.loadModule = function (moduleName) {
            var deferred = $q.defer();
            var dependencyName = 'publishModule';
            $script('app/' + moduleName + '.js', dependencyName);
            $script.ready(dependencyName,
                function () {
                    if (window[moduleName]) {
                        deferred.resolve(window[moduleName]);
                    } else {
                        deferred.reject();
                    }
                });

            return deferred.promise;
        }
    }
}());