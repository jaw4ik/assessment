define(['events'], function (events) {

    var
        _listeners = {},

        fireEvent = function (eventName, eventData) {

            if (!_.isString(eventName) || _.isEmpty(eventName)) {
                throw new Error("Event object missing 'eventName' property.");
            }

            var deferredQueue = Q();

            if (_.isArray(_listeners[eventName])) {
                var listeners = _listeners[eventName];

                _.each(listeners, function (listener) {
                    
                    deferredQueue = deferredQueue.then(function () {
                        return listener(eventData);
                    });
                });
            }

            return deferredQueue;
        },

        addEventListener = function (eventName, listener) {
            if (_.isUndefined(_listeners[eventName])) {
                _listeners[eventName] = [];
            }

            _listeners[eventName].push(listener);
        },

        removeEventListener = function (eventName, listener) {
            if (_.isArray(_listeners[eventName])) {
                _listeners[eventName] = _.without(_listeners[eventName], listener);
            }
        },

        removeAllListeners = function () {
            _listeners = {};
        };

    return {
        
        fireEvent: fireEvent,

        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        removeAllListeners: removeAllListeners,

        eventsList: events
        
    };

});