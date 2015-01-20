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
            if (!callback) {
                $rootScope.$emit(eventName, data);
                return;
            }

            if (!$rootScope.$$listenerCount[eventName] || $rootScope.$$listenerCount[eventName] == 0) {
                callback.apply();
                return;
            }

            var listeners = $rootScope.$$listeners[eventName];
            var promises = [];
            listeners.forEach(function (listener) {
                if (_.isFunction(listener)) {
                    executeListenerFunction(listener);
                }
            });

            if (promises.length == 0) {
                callback.apply();
                return;
            }

            $q.all(promises).then(function () {
                callback.apply();
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