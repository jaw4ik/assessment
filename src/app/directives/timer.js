(function () {

    angular.module('quiz')
        .directive('timer', timer);

    function timer() {
        return {
            restrict: 'E',
            scope: {
                hoursValue: '=hours',
                minutesValue: '=minutes',
                secondsValue: '=seconds'
            },
            templateUrl: 'app/views/timer.html',
            link: function ($scope) {
                var intervalId;

                $scope.time = $scope.hoursValue * 3600 + $scope.minutesValue * 60 + $scope.secondsValue;
                $scope.$on('$timerStart', start);

                function start() {
                    intervalId = setInterval(tick, 1000);
                }

                function stop() {
                    clearInterval(intervalId);
                    $scope.$emit('$timerStopped');
                }

                function tick() {
                    $scope.time--;
                    if ($scope.time <= 0) {
                        stop();
                    }
                    $scope.$apply();
                }
            }
        };
    }

})();