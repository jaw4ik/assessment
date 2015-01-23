(function () {
    'use strict';
    angular.module('quiz.publishSettings')
           .service('publishModuleLoader', PublishModuleLoader);

    PublishModuleLoader.$inject = ['$q', '$window'];

    function PublishModuleLoader($q, $window) {
        var that = this;

        that.load = function(moduleName) {
            var deferred = $q.defer(),
                scriptLoader;
            
            /* jshint ignore:start */
            scriptLoader = $script;
            /* jshint ignore:end */

            var dependencyName = 'publishModule';
            scriptLoader('app/' + moduleName + '.js', dependencyName);
            scriptLoader.ready(dependencyName, onScriptReady);

            return deferred.promise;

            function onScriptReady() {
                if ($window[moduleName]) {
                    deferred.resolve($window[moduleName]);
                } else {
                    deferred.reject();
                }
            }
        };
    }
}());