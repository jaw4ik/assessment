define(['events'], function (events) {

    var
        _listeners = {},

        _fire = function (eventName, eventData) {

            if (!_.isString(eventName) || _.isEmpty(eventName)) {
                throw new Error("Event object missing 'eventName' property.");
            }

            if (_.isArray(_listeners[eventName])) {
                var listeners = _listeners[eventName];

                _.each(listeners, function (listener) {
                    listener.call(this, eventData);
                });
            }
        },

        addListener = function (eventName, listener) {
            if (_.isUndefined(_listeners[eventName])) {
                _listeners[eventName] = [];
            }

            _listeners[eventName].push(listener);
        },

        removeListener = function (eventName, listener) {
            if (_.isArray(_listeners[eventName])) {
                _listeners[eventName] = _.without(_listeners[eventName], listener);
            }
        },

        removeAllListeners = function () {
            _listeners = {};
        },


        //#region Events
        
        courseStarted = function () {
            _fire(events.courseStarted);
        },

        courseStopped = function () {
            _fire(events.courseStopped);
        },

        courseFinished = function (result) {
            _fire(events.courseFinished, result / 100);
        };
    
        //#endregion Events

    return {
        //#region Private properties
        
        addListener: addListener,
        removeListener: removeListener,
        removeAllListeners: removeAllListeners,

        //#endregion Private properties


        //#region Events

        courseStarted: courseStarted,
        courseStopped: courseStopped,
        courseFinished: courseFinished

        //#endregion Events
    };

});