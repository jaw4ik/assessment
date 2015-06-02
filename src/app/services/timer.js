(function () {
    "use strict";

    angular.module('quiz')
        .service('timer', timer);

    timer.$inject = ['$timeout'];

    function timer($timeout) {
        var onTickSubscribers = [],
            onStoppedSubscribers = [],
            remainingTime,
            isTimerOn = false;

        return {
            setTime: setTime,
            onStopped: onStopped,
            onTick: onTick,
            start: start,
            dispose: dispose
        };

        function setTime(timeInSeconds) {
            remainingTime = timeInSeconds;
        }

        function onStopped(callback) {
            onStoppedSubscribers.push(callback);
        }

        function onTick(callback) {
            onTickSubscribers.push(callback);
        }

        function start() {
            isTimerOn = true;
            tick();
        }

        function tick() {
            $timeout(function () {
                if (!isTimerOn) {
                    return;
                }

                remainingTime--;
                fireTickEvent();

                if (remainingTime <= 0) {
                    fireStoppedEvent();
                    dispose();
                } else {
                    tick();
                }
            }, 1000);
        }

        function fireTickEvent() {
            onTickSubscribers.forEach(function (callback) {
                callback(remainingTime);
            });
        }

        function fireStoppedEvent() {
            onStoppedSubscribers.forEach(function (callback) {
                callback();
            });
        }

        function dispose() {
            remainingTime = 0;
            isTimerOn = false;
            onTickSubscribers = [];
            onStoppedSubscribers = [];
        }
    }

})();