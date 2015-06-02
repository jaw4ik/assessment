(function () {

    angular.module('quiz')
        .directive('timer', timer);

    function timer() {
        return {
            restrict: 'E',
            scope: {
                timeInSeconds: '=timeInSeconds'
            },
            templateUrl: 'app/views/timer.html'
        };
    }

})();