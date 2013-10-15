define(['events'], function (events) {

    var
        _listeners = {},

        fireEvent = function (eventName, eventData) {

            if (!_.isString(eventName) || _.isEmpty(eventName)) {
                throw new Error("Event object missing 'eventName' property.");
            }

            return $.when(ko.utils.arrayMap(_listeners[eventName], function (event) {
                return $.Deferred(function () {
                    event(eventData);
                });
            }));
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