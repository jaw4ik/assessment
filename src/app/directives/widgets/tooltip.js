(function () {

    angular.module('quiz')
        .directive('tooltip', tooltip);

    function tooltip() {
        return {
            transclude: true,
            restrict: 'E',
            templateUrl: 'views/widgets/tooltip.html'
        };
    }

}());