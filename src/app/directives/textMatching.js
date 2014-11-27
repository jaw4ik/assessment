(function () {

    angular.module('quiz')
        .directive('textMatching', textMatching);

    function textMatching() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/TextMatching.html'
        };
    }

}());