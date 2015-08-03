(function () {

    angular.module('assessment')
        .directive('tooltip', tooltip);

    function tooltip() {
        return {
            transclude: true,
            restrict: 'E',
            templateUrl: 'app/views/widgets/tooltip.html'
        };
    }

}());