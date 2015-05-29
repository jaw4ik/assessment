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
                $scope.time = $scope.hoursValue * 3600 + $scope.minutesValue * 60 + $scope.secondsValue;
                $scope.$on('$timerStart', start);

                function start() {
                    setTimeout(tick, 1000);
                }

                function stop() {
                    $scope.$emit('$timerStopped');
                }

                function tick() {
                    $scope.time--;
                    $scope.$apply();

                    if ($scope.time <= 0) {
                        stop();
                    } else {
                        setTimeout(tick, 1000);
                    }
                }
            }
        };
    }

})();