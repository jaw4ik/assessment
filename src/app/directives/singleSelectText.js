(function () {

    angular.module('quiz')
        .directive('singleselectText', singleSelectText);

    function singleSelectText() {
        return {
            restrict: 'E',
            templateUrl: 'views/singleSelectText.html'
        };
    }

}());