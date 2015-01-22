(function () {
    'use strict';

    angular.module('quiz')
           .factory('eventPublisher', eventPublisher);

    eventPublisher.$inject = ['$rootScope', '$q'];

    function eventPublisher($rootScope, $q) {
        var factory = {
            publishRootScopeEvent: publishRootScopeEvent
        };

        return factory;

        function publishRootScopeEvent(eventName, data, callback) {
            var listeners = $rootScope.$$listeners[eventName];
            var promises = [];

            _.each(listeners, function (listener) {
                if (_.isFunction(listener)) {
                    executeListenerFunction(listener);
                }
            });

            $q.all(promises).then(function () {
                if (callback) {
                    callback.apply();
                }
            });

            function executeListenerFunction(func) {
                var listenerResult = func($rootScope, data);
                if (listenerResult && _.isFunction(listenerResult.then)) {
                    promises.push(listenerResult);
                }
            }
        }
    }
}());