define(['events'], function (events) {

    var
        _listeners = {},

        fireEvent = function (eventName, eventData) {

            if (!_.isString(eventName) || _.isEmpty(eventName)) {
                throw new Error("Event object missing 'eventName' property.");
            }

            var deferredList = Q();

            _.each(_listeners[eventName], function (event) {
                deferredList = deferredList.then(function () {
                    return event(eventData);
                });
            });

            return deferredList;
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