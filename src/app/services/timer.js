(function () {
    "use strict";

    angular.module('quiz')
        .service('timer', timer);

    timer.$inject = ['$timeout'];

    function timer($timeout) {
        var onTickSubscribers = [],
            onStoppedSubscribers = [],
            remainingTime;

        return {
            setTime: setTime,
            onStopped: onStopped,
            onTick: onTick,
            start: start
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
            $timeout(tick, 1000);
        }

        function tick() {
            remainingTime--;
            fireTickEvent();

            if (remainingTime <= 0) {
                fireStoppedEvent();
            } else {
                $timeout(tick, 1000);
            }
        }

        function fireTickEvent() {
            onTickSubscribers.forEach(function (callbackFn) {
                callbackFn(remainingTime);
            });
        }

        function fireStoppedEvent() {
            onStoppedSubscribers.forEach(function (callbackFn) {
                callbackFn();
            });
        }
    }

})();